"use client";

import { useEffect, useRef } from "react";
import { smoothCurve } from "@/lib/curves";
import { formatDate } from "@/lib/format";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** public/data/gilt-curves.json. Passed in by the server, so the data isn't in the JS bundle. */
export type GiltCurves = {
  asOf: string;
  maturities: number[];
  curves: { date: string; yields: number[] }[];
};

/**
 * The hero ribbon: the last 60 days of UK gilt yield curves, drawn as one flowing sheet.
 * Each strand is a real curve (maturity across, yield up), newest at the front in deep blue,
 * oldest at the back in periwinkle, the latest close in gold. Extra strands are blended
 * between neighbouring days so the sheet reads as silk rather than separate lines.
 *
 * Drawn with the 2D canvas. It ripples slowly, parts around the cursor, draws itself in on
 * load, and stops when off screen, when the tab is hidden, or under reduced motion.
 */

const SAMPLES = 72; // points along each strand

type Strand = { age: number; yields: number[]; colour: string; width: number };

/**
 * Where the sheet sits, as fractions of the canvas. It runs edge to edge, rising from the bottom
 * left to the upper right. `fade` is how visible it is across the width: faint under the text on
 * the left, full strength on the right, so it passes behind the headline instead of stopping.
 */
function composition(narrow: boolean) {
  if (narrow) {
    return {
      originX: -0.25,
      spanX: 1.45,
      baseY: 1.02,
      rise: 0.34,
      depthX: 0.1,
      depthY: 0.3,
      fade: [
        [0, 0.16],
        [1, 0.42],
      ],
    };
  }
  return {
    originX: -0.04,
    spanX: 1.1,
    baseY: 1.04,
    rise: 0.52,
    depthX: 0.05,
    depthY: 0.44,
    fade: [
      [0, 0.08],
      [0.36, 0.14],
      [0.66, 1],
    ],
  };
}

function hexToRgb(hex: string) {
  const v = parseInt(hex.trim().slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

// Colour by age: back (oldest) periwinkle, through violet and blue, to deep blue at the front.
function rampColour(stops: number[][], age: number, alpha: number) {
  const scaled = age * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(scaled));
  const t = scaled - i;
  const [r, g, b] = stops[i].map((c, k) => Math.round(c + (stops[i + 1][k] - c) * t));
  return `rgb(${r} ${g} ${b} / ${alpha.toFixed(3)})`;
}

function buildStrands(data: GiltCurves, blend: number, night: boolean): Strand[] {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string) => hexToRgb(style.getPropertyValue(name));
  // On light, the sheet darkens towards the front. On night it brightens towards the front,
  // and strands add together where they overlap, so the dense parts glow.
  const stops = (
    night
      ? ["--ribbon-front", "--ribbon-iris", "--signal-soft", "--night-text"]
      : ["--ribbon-back", "--ribbon-iris", "--ribbon-mid", "--ribbon-front"]
  ).map(token);
  const gold = style.getPropertyValue("--gilt").trim();

  const logs = data.maturities.map(Math.log);
  const at = Array.from(
    { length: SAMPLES },
    (_, i) => logs[0] + ((logs[logs.length - 1] - logs[0]) * i) / (SAMPLES - 1),
  );
  const days = data.curves.map((c) => smoothCurve(logs, c.yields, at));

  const strands: Strand[] = [];
  const total = (days.length - 1) * blend;
  for (let s = 0; s < total; s++) {
    const day = Math.floor(s / blend);
    const t = (s % blend) / blend;
    const age = s / total;
    strands.push({
      age,
      yields: days[day].map((y, i) => y + (days[day + 1][i] - y) * t),
      colour: rampColour(stops, age, night ? 0.1 + 0.32 * age : 0.12 + 0.34 * age),
      width: 0.8,
    });
  }
  strands.push({ age: 1, yields: days[days.length - 1], colour: gold, width: 2 });
  return strands;
}

export function GiltRibbon({
  data,
  tone = "light",
  className,
}: {
  data: GiltCurves;
  tone?: "light" | "night";
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const focusRef = useRef<HTMLButtonElement>(null);
  // Follows the visitor's reduced-motion setting.
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const night = tone === "night";
    const strands = buildStrands(data, coarse ? 1 : 4, night);
    const all = data.curves.flatMap((c) => c.yields);
    const logMin = Math.log(data.maturities[0]);
    const logMax = Math.log(data.maturities[data.maturities.length - 1]);
    const yMin = Math.min(...all);
    const yMax = Math.max(...all);

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    // Adaptive quality: if the first second runs slowly, draw half the strands.
    let lite = false;
    let lastFrame = 0;
    const frameTimes: number[] = [];
    const start = performance.now();
    const pointer = { x: -1e4, y: -1e4, strength: 0, inside: false };
    // Where the gold (latest) curve was last drawn, for the tooltip.
    const gold = new Float32Array(SAMPLES * 2);
    let goldDrawn = false;
    let goldVisibleFrom = 0;
    let tipIndex = -1;

    function resize() {
      const box = canvas!.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = box.width;
      height = box.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now: number) {
      const elapsed = reduced ? 1e6 : now - start;
      const time = elapsed / 1000;
      pointer.strength += ((pointer.inside ? 1 : 0) - pointer.strength) * 0.08;
      if (!lite && lastFrame && frameTimes.length < 60) {
        frameTimes.push(now - lastFrame);
        if (frameTimes.length === 60) {
          lite = frameTimes.reduce((sum, t) => sum + t, 0) / 60 > 24;
        }
      }
      lastFrame = now;

      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = night ? "lighter" : "source-over";
      const narrow = width < 1024;
      const c = composition(narrow);
      const originX = width * c.originX;
      const spanX = width * c.spanX;
      const baseY = height * c.baseY;
      const rise = height * c.rise;
      const depthX = width * c.depthX;
      const depthY = height * c.depthY;
      const ripple = reduced ? 0 : height * 0.02;

      for (let s = 0; s < strands.length; s++) {
        const strand = strands[s];
        if (lite && s % 2 === 1 && s !== strands.length - 1) continue;
        // Draw-in: oldest strands first, short maturities to long, latest gold curve last.
        const delay = strand.width > 2 ? 1200 : strand.age * 900;
        const progress = Math.min(1, Math.max(0, (elapsed - delay) / 700));
        const count = Math.ceil(progress * (SAMPLES - 1)) + 1;
        if (progress <= 0) continue;

        const back = 1 - strand.age;
        const isGold = s === strands.length - 1;
        ctx!.beginPath();
        for (let i = 0; i < count; i++) {
          const u = i / (SAMPLES - 1);
          let x = originX + u * spanX + back * depthX;
          let y =
            baseY -
            ((strand.yields[i] - yMin) / (yMax - yMin)) * rise -
            back * depthY +
            ripple * Math.sin(u * 4.2 + strand.age * 6.5 + time * 0.32) * (0.4 + 0.6 * u);

          // The gold curve holds still; the rest part around the cursor.
          if (pointer.strength > 0.01 && !isGold) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 160) {
              const push = (1 - d / 160) ** 2 * 26 * pointer.strength;
              x += (dx / (d || 1)) * push * 0.4;
              y += (dy / (d || 1)) * push;
            }
          }
          if (isGold) {
            gold[i * 2] = x;
            gold[i * 2 + 1] = y;
          }
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        if (isGold) goldDrawn = count === SAMPLES;
        ctx!.strokeStyle = strand.colour;
        ctx!.lineWidth = strand.width;
        ctx!.stroke();
      }

      ctx!.globalCompositeOperation = "source-over";
      // The tooltip only answers where the sheet is at full strength.
      goldVisibleFrom = narrow ? width : width * 0.6;
      if (tipIndex >= 0) placeTip(tipIndex);

      // Fade the whole sheet across the width: faint behind the text, full on the right.
      const fade = ctx!.createLinearGradient(0, 0, width, 0);
      for (const [at, alpha] of c.fade) fade.addColorStop(at, `rgb(0 0 0 / ${alpha})`);
      ctx!.globalCompositeOperation = "destination-in";
      ctx!.fillStyle = fade;
      ctx!.fillRect(0, 0, width, height);
      ctx!.globalCompositeOperation = "source-over";

      const settling = elapsed < 2000 || pointer.strength > 0.01;
      if (visible && !document.hidden && (!reduced || settling)) {
        frame = requestAnimationFrame(draw);
      }
    }

    function restart() {
      lastFrame = 0;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    }

    // The tooltip: date, maturity and yield at the nearest real data point on the gold curve.
    function placeTip(i: number) {
      const tip = tipRef.current;
      const dot = dotRef.current;
      if (!tip || !dot) return;
      const logMaturity = logMin + ((logMax - logMin) * i) / (SAMPLES - 1);
      const nearest = data.maturities.reduce(
        (best, m, k) =>
          Math.abs(Math.log(m) - logMaturity) <
          Math.abs(Math.log(data.maturities[best]) - logMaturity)
            ? k
            : best,
        0,
      );
      const m = data.maturities[nearest];
      const label = m < 1 ? `${m * 12}-month` : `${m}-year`;
      const value = data.curves[data.curves.length - 1].yields[nearest].toFixed(2);
      tip.textContent = `${formatDate(data.asOf)}, ${label} ${value}%`;
      for (const el of [tip, dot]) {
        el.style.left = `${gold[i * 2]}px`;
        el.style.top = `${gold[i * 2 + 1]}px`;
        el.style.opacity = "1";
      }
    }
    function hideTip() {
      tipIndex = -1;
      for (const el of [tipRef.current, dotRef.current]) if (el) el.style.opacity = "0";
    }

    function onPointerMove(event: PointerEvent) {
      const box = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.inside = pointer.y >= 0 && pointer.y <= box.height;

      let closest = -1;
      let best = 16;
      if (goldDrawn && pointer.inside) {
        for (let i = 0; i < SAMPLES; i++) {
          if (gold[i * 2] < goldVisibleFrom) continue;
          const d = Math.hypot(gold[i * 2] - pointer.x, gold[i * 2 + 1] - pointer.y);
          if (d < best) [best, closest] = [d, i];
        }
      }
      if (closest >= 0) {
        tipIndex = closest;
        placeTip(closest);
      } else if (document.activeElement !== focusRef.current) {
        hideTip();
      }
      if (!reduced) restart();
    }

    // Keyboard: focusing the hidden button shows the tooltip at the 10-year point.
    const tenYear = Math.round(((Math.log(10) - logMin) / (logMax - logMin)) * (SAMPLES - 1));
    const onFocus = () => {
      if (!goldDrawn) return;
      tipIndex = tenYear;
      placeTip(tenYear);
    };
    const focusButton = focusRef.current;
    focusButton?.addEventListener("focus", onFocus);
    focusButton?.addEventListener("blur", hideTip);

    const resizer = new ResizeObserver(() => {
      resize();
      restart();
    });
    resizer.observe(canvas);

    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) restart();
    });
    watcher.observe(canvas);

    const onVisibility = () => !document.hidden && restart();
    document.addEventListener("visibilitychange", onVisibility);
    if (!coarse) window.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      focusButton?.removeEventListener("focus", onFocus);
      focusButton?.removeEventListener("blur", hideTip);
    };
  }, [reduced, tone, data]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className={className} />
      <span
        ref={dotRef}
        aria-hidden
        className="pointer-events-none absolute z-10 size-2.5 -translate-1/2 rounded-full bg-gilt opacity-0 ring-2 ring-night transition-opacity duration-(--dur-hover)"
      />
      <div
        ref={tipRef}
        id="gilt-tooltip"
        role="tooltip"
        className="glass pointer-events-none absolute z-10 -translate-x-1/2 translate-y-[calc(-100%-14px)] rounded-inline px-3 py-1.5 text-small whitespace-nowrap text-ink opacity-0 transition-opacity duration-(--dur-hover)"
      />
      <button ref={focusRef} type="button" aria-describedby="gilt-tooltip" className="sr-only">
        Latest gilt yields
      </button>
    </>
  );
}
