"use client";

import { useEffect, useRef, useState } from "react";
import { smoothCurve } from "@/lib/curves";

type History = { maturities: number[]; curves: { date: string; yields: number[] }[] };

const ROWS = 72; // maturity samples, 1 to 30 years on a square-root scale
const INTERVAL = 0.25; // contour interval, percentage points
const DRAW_MS = 1500;

export type SpotHeight = { maturity: string; date: string; value: string } | null;

/**
 * Ten years of weekly gilt curves drawn as an Ordnance Survey style contour map: time runs left to
 * right, maturity bottom to top, and every 0.25 percentage points of yield is a contour. Low ground
 * (yields under 2%) is washed blue. The gold contour is today's 10-year yield. Contours draw from
 * low ground to high on load; the pointer gets a crosshair and reports the spot height.
 */
export function ContourMap({
  data,
  gold,
  className,
  onSpot,
}: {
  data: History;
  gold: number;
  className?: string;
  onSpot?: (spot: SpotHeight) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(el);
    const colour = {
      contour: css.getPropertyValue("--contour").trim(),
      index: css.getPropertyValue("--contour-index").trim(),
      gold: css.getPropertyValue("--gilt").trim(),
      ink: css.getPropertyValue("--ink").trim(),
      water: css.getPropertyValue("--water").trim(),
    };

    // The grid: one column per week, ROWS maturities per column. Contours are drawn from a copy
    // smoothed over about a month (Gaussian, sigma 4 weeks), so weekly noise does not read as
    // terrain; the spot heights read the published figures.
    const { maturities, curves } = data;
    const r0 = Math.sqrt(maturities[0]);
    const r1 = Math.sqrt(maturities.at(-1)!);
    const rowMaturity = Array.from(
      { length: ROWS },
      (_, j) => (r0 + (j / (ROWS - 1)) * (r1 - r0)) ** 2,
    );
    const raw = curves.map((c) => smoothCurve(maturities, c.yields, rowMaturity));
    const SIGMA = 4;
    const kernel = Array.from({ length: SIGMA * 6 + 1 }, (_, k) =>
      Math.exp(-((k - SIGMA * 3) ** 2) / (2 * SIGMA * SIGMA)),
    );
    const grid = raw.map((col, i) =>
      col.map((_, j) => {
        let sum = 0;
        let weight = 0;
        kernel.forEach((w, k) => {
          const c = raw[i + k - SIGMA * 3];
          if (c) {
            sum += w * c[j];
            weight += w;
          }
        });
        return sum / weight;
      }),
    );
    const COLS = grid.length;
    const values = grid.flat();
    const lo = Math.min(...values);
    const hi = Math.max(...values);

    // Marching squares: line segments (in grid units) for each contour level.
    const levels: number[] = [];
    for (let v = Math.ceil(lo / INTERVAL) * INTERVAL; v <= hi; v += INTERVAL)
      levels.push(+v.toFixed(2));
    const segmentsAt = (level: number) => {
      const out: number[] = [];
      const cross = (a: number, b: number) => (level - a) / (b - a);
      for (let i = 0; i < COLS - 1; i++) {
        for (let j = 0; j < ROWS - 1; j++) {
          const a = grid[i][j]; // bottom left
          const b = grid[i + 1][j]; // bottom right
          const c = grid[i + 1][j + 1]; // top right
          const d = grid[i][j + 1]; // top left
          const pts: number[] = [];
          if (a < level !== b < level) pts.push(i + cross(a, b), j);
          if (b < level !== c < level) pts.push(i + 1, j + cross(b, c));
          if (c < level !== d < level) pts.push(i + 1 - cross(c, d), j + 1);
          if (d < level !== a < level) pts.push(i, j + 1 - cross(d, a));
          if (pts.length >= 4) out.push(pts[0], pts[1], pts[2], pts[3]);
          if (pts.length === 8) out.push(pts[4], pts[5], pts[6], pts[7]);
        }
      }
      return out;
    };
    const contours = levels.map((level) => ({ level, segments: segmentsAt(level) }));
    const goldSegments = segmentsAt(gold);

    // Low ground wash: blue, strongest where yields are lowest, fading out by 2%.
    const wash = document.createElement("canvas");
    wash.width = COLS;
    wash.height = ROWS;
    const image = wash.getContext("2d")!.createImageData(COLS, ROWS);
    const [wr, wg, wb] = colour.water.split(/\s+/).map(Number);
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const k = ((ROWS - 1 - j) * COLS + i) * 4;
        const depth = Math.max(0, Math.min(1, (2 - grid[i][j]) / 2.2));
        image.data.set([wr, wg, wb, Math.round(depth * 0.3 * 255)], k);
      }
    }
    wash.getContext("2d")!.putImageData(image, 0, 0);

    let width = 0;
    let height = 0;
    let dpr = 1;
    const start = performance.now();
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    function stroke(segments: number[], style: string, lineWidth: number) {
      ctx.setTransform(
        (dpr * width) / (COLS - 1),
        0,
        0,
        (-dpr * height) / (ROWS - 1),
        0,
        dpr * height,
      );
      ctx.beginPath();
      for (let s = 0; s < segments.length; s += 4) {
        ctx.moveTo(segments[s], segments[s + 1]);
        ctx.lineTo(segments[s + 2], segments[s + 3]);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = style;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    function draw(now: number) {
      frame = 0;
      const progress = reduced ? 1 : Math.min(1, (now - start) / DRAW_MS);
      const shown = (1 - Math.pow(1 - progress, 2)) * (contours.length + 1);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, el.width, el.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = Math.min(1, progress * 1.5);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(wash, 0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.lineJoin = "round";
      contours.forEach(({ level, segments }, n) => {
        if (n > shown) return;
        const isIndex = Math.abs(level - Math.round(level)) < 1e-6;
        stroke(segments, isIndex ? colour.index : colour.contour, isIndex ? 1 : 0.6);
      });
      if (progress === 1) stroke(goldSegments, colour.gold, 2);

      if (pointer) {
        ctx.strokeStyle = colour.ink;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pointer.x + 0.5, 0);
        ctx.lineTo(pointer.x + 0.5, height);
        ctx.moveTo(0, pointer.y + 0.5);
        ctx.lineTo(width, pointer.y + 0.5);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = colour.ink;
        ctx.fill();
      }
      if (progress < 1) frame = requestAnimationFrame(draw);
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    function layout() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const box = el.getBoundingClientRect();
      width = box.width;
      height = box.height;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      schedule();
    }

    // The spot height under the pointer: nearest week, and the yield at that maturity.
    function move(e: PointerEvent) {
      const box = el.getBoundingClientRect();
      const fx = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
      const fy = Math.min(1, Math.max(0, (e.clientY - box.top) / box.height));
      const i = Math.round(fx * (COLS - 1));
      const j = Math.round((1 - fy) * (ROWS - 1));
      pointer = { x: e.clientX - box.left, y: e.clientY - box.top };
      // Read the published figure at the nearest published maturity, not the interpolated grid.
      const k = maturities.reduce(
        (best, m, n) =>
          Math.abs(m - rowMaturity[j]) < Math.abs(maturities[best] - rowMaturity[j]) ? n : best,
        0,
      );
      onSpot?.({
        maturity: `${maturities[k]}-year`,
        date: new Date(`${curves[i].date}T12:00:00Z`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }),
        value: `${curves[i].yields[k].toFixed(2)}%`,
      });
      schedule();
    }
    function leave() {
      pointer = null;
      onSpot?.(null);
      schedule();
    }

    layout();
    const resize = new ResizeObserver(layout);
    resize.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [data, gold, onSpot]);

  return <canvas ref={canvas} aria-hidden className={className} />;
}

/** The map with its spot-height readout, as one client island. */
export function SurveyMap({
  data,
  gold,
  className,
}: {
  data: History;
  gold: number;
  className?: string;
}) {
  const [spot, setSpot] = useState<SpotHeight>(null);
  return (
    <>
      <ContourMap data={data} gold={gold} className={className} onSpot={setSpot} />
      <p
        aria-hidden
        className="pointer-events-none absolute right-(--gutter) bottom-14 z-10 text-right text-small text-slate max-md:hidden"
      >
        {spot ? (
          <>
            <span className="block text-muted">Spot height</span>
            {spot.maturity}, {spot.date}:{" "}
            <span className="font-semibold text-ink">{spot.value}</span>
          </>
        ) : (
          <span className="text-muted">Move across the map to read a yield</span>
        )}
      </p>
    </>
  );
}
