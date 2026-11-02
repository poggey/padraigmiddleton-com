"use client";

import { useEffect, useRef } from "react";
import { smoothCurve } from "@/lib/curves";

type Curves = { maturities: number[]; curves: { date: string; yields: number[] }[] };

const SAMPLES = 540; // points around each ring
const TURN_SECONDS = 360; // one full turn every six minutes
const DRAW_MS = 1800; // the engraving tool's first pass
const LIGHT_RADIUS = 150;

/**
 * A guilloché rosette, like the pattern behind the portrait on a banknote, drawn from the last 60
 * gilt curves. Each day's curve (6 months out to 30 years and back) sets the shape of one looping
 * line in each band; the waves are phase-shifted day by day, so the lines cross into a lattice.
 * Today's curve is in gold. It turns slowly, and lines near the pointer catch the light.
 */
export function Rosette({ data, className }: { data: Curves; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(el);
    const ink = css.getPropertyValue("--engrave").trim();
    const gold = css.getPropertyValue("--gilt").trim();
    const light = css.getPropertyValue("--signal").trim();

    // Each curve as a closed loop: short end to long end over the top, and back underneath.
    const all = data.curves.flatMap((c) => c.yields);
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const idx = data.maturities.map((_, i) => i);
    const last = idx.length - 1;
    const at = Array.from({ length: SAMPLES }, (_, s) => {
      const u = (s / SAMPLES) * 2;
      return (u <= 1 ? u : 2 - u) * last;
    });
    const shapes = data.curves.map((c) =>
      smoothCurve(idx, c.yields, at).map((y) => (y - lo) / (hi - lo)),
    );

    let size = 0;
    let base: HTMLCanvasElement;
    let lit: HTMLCanvasElement;
    const scratch = document.createElement("canvas");

    // Draws the full rosette, centred, in one colour (the gold line always gold).
    function engrave(target: HTMLCanvasElement, colour: string, width: number) {
      const g = target.getContext("2d")!;
      const r = size / 2;
      g.clearRect(0, 0, size, size);
      g.lineJoin = "round";
      const bands = [
        { inner: 0.66, swell: 0.12, wave: 0.085, turns: 18, dir: 1 },
        { inner: 0.38, swell: 0.08, wave: 0.07, turns: 11, dir: -1 },
        { inner: 0.14, swell: 0.04, wave: 0.06, turns: 6, dir: 1 },
      ];
      // Every third day, so the lines stay open enough to read as a lattice, plus today.
      const days = shapes.map((_, i) => i).filter((i) => (shapes.length - 1 - i) % 3 === 0);
      days.forEach((day, n) => {
        const shape = shapes[day];
        const today = day === shapes.length - 1;
        const phase = (n / days.length) * Math.PI * 2;
        g.strokeStyle = today ? gold : colour;
        g.lineWidth = today ? width * 2.2 : width;
        for (const b of bands) {
          g.beginPath();
          for (let s = 0; s <= SAMPLES; s++) {
            const t = ((s % SAMPLES) / SAMPLES) * Math.PI * 2;
            const radius =
              r *
              (b.inner +
                b.swell * shape[s % SAMPLES] +
                b.wave * Math.sin(b.turns * t + b.dir * phase));
            const x = r + radius * Math.sin(t);
            const y = r - radius * Math.cos(t);
            if (s) g.lineTo(x, y);
            else g.moveTo(x, y);
          }
          g.stroke();
        }
      });
      // Two fine rules close the outer edge, as on a printed note.
      g.strokeStyle = colour;
      g.lineWidth = width;
      for (const k of [0.955, 0.975]) {
        g.beginPath();
        g.arc(r, r, r * k, 0, Math.PI * 2);
        g.stroke();
      }
    }

    function layout() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const box = el.getBoundingClientRect();
      el.width = Math.round(box.width * dpr);
      el.height = Math.round(box.height * dpr);
      size = Math.min(el.width, el.height);
      base = document.createElement("canvas");
      lit = document.createElement("canvas");
      for (const c of [base, lit, scratch]) c.width = c.height = size;
      engrave(base, ink, 0.6 * dpr);
      engrave(lit, light, 1 * dpr);
    }

    const pointer = { x: 0, y: 0, strength: 0, target: 0 };
    const start = performance.now();
    let frame = 0;

    function draw(now: number) {
      frame = 0;
      const dpr = el.width / el.getBoundingClientRect().width || 1;
      const angle = reduced ? 0 : ((now - start) / 1000 / TURN_SECONDS) * Math.PI * 2;
      const drawn = reduced ? 1 : Math.min(1, (now - start) / DRAW_MS);
      const cx = el.width / 2;
      const cy = el.height / 2;
      pointer.strength += (pointer.target - pointer.strength) * 0.12;

      ctx.clearRect(0, 0, el.width, el.height);
      ctx.save();
      if (drawn < 1) {
        // The first pass: a sweep from twelve o'clock, like a tool cutting the plate.
        const eased = 1 - Math.pow(1 - drawn, 3);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, size, -Math.PI / 2, -Math.PI / 2 + eased * Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }
      placed(ctx, base, cx, cy, angle);

      if (pointer.strength > 0.01) {
        const s = scratch.getContext("2d")!;
        s.globalCompositeOperation = "source-over";
        s.clearRect(0, 0, size, size);
        placed(s, lit, size / 2, size / 2, angle);
        s.globalCompositeOperation = "destination-in";
        const px = pointer.x * dpr - (cx - size / 2);
        const py = pointer.y * dpr - (cy - size / 2);
        const glow = s.createRadialGradient(px, py, 0, px, py, LIGHT_RADIUS * dpr);
        glow.addColorStop(0, `rgb(0 0 0 / ${pointer.strength})`);
        glow.addColorStop(1, "rgb(0 0 0 / 0)");
        s.fillStyle = glow;
        s.fillRect(0, 0, size, size);
        ctx.drawImage(scratch, cx - size / 2, cy - size / 2);
      }
      ctx.restore();

      const settling = Math.abs(pointer.target - pointer.strength) > 0.01;
      if (!reduced || drawn < 1 || settling) frame = requestAnimationFrame(draw);
    }

    function placed(
      g: CanvasRenderingContext2D,
      img: HTMLCanvasElement,
      x: number,
      y: number,
      a: number,
    ) {
      g.save();
      g.translate(x, y);
      g.rotate(a);
      g.drawImage(img, -size / 2, -size / 2);
      g.restore();
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    function move(e: PointerEvent) {
      const box = el.getBoundingClientRect();
      pointer.x = e.clientX - box.left;
      pointer.y = e.clientY - box.top;
      pointer.target = 1;
      schedule();
    }
    function leave() {
      pointer.target = 0;
      schedule();
    }

    layout();
    schedule();
    const resize = new ResizeObserver(() => {
      layout();
      schedule();
    });
    resize.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [data]);

  return <canvas ref={canvas} aria-hidden className={className} />;
}
