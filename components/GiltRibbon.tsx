"use client";

import { useEffect, useRef } from "react";
import { smoothCurve } from "@/lib/curves";
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

const SAMPLES = 96; // points along each strand

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
    // One strand's points, reused for every strand.
    const points = new Float32Array(SAMPLES * 2);

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
        const delay = strand.width >= 2 ? 1200 : strand.age * 900;
        const progress = Math.min(1, Math.max(0, (elapsed - delay) / 700));
        const count = Math.ceil(progress * (SAMPLES - 1)) + 1;
        if (progress <= 0) continue;

        const back = 1 - strand.age;
        for (let i = 0; i < count; i++) {
          const u = i / (SAMPLES - 1);
          const x = originX + u * spanX + back * depthX;
          let y =
            baseY -
            ((strand.yields[i] - yMin) / (yMax - yMin)) * rise -
            back * depthY +
            ripple * Math.sin(u * 4.2 + strand.age * 6.5 + time * 0.32) * (0.4 + 0.6 * u);

          // Strands part around the cursor in a smooth, rounded lens: each is pushed up or down
          // by a bell-shaped amount that fades with distance, so none ever kink or cross.
          if (pointer.strength > 0.01) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const along = Math.exp(-(dx * dx) / (2 * 120 * 120));
            const across = (dy / 46) * Math.exp(-(dy * dy) / (2 * 46 * 46));
            y += 34 * pointer.strength * along * across;
          }
          points[i * 2] = x;
          points[i * 2 + 1] = y;
        }

        // A smooth curve through the points: each segment bends through the midpoints.
        ctx!.beginPath();
        ctx!.moveTo(points[0], points[1]);
        for (let i = 1; i < count - 1; i++) {
          const mx = (points[i * 2] + points[i * 2 + 2]) / 2;
          const my = (points[i * 2 + 1] + points[i * 2 + 3]) / 2;
          ctx!.quadraticCurveTo(points[i * 2], points[i * 2 + 1], mx, my);
        }
        if (count > 1) ctx!.lineTo(points[(count - 1) * 2], points[(count - 1) * 2 + 1]);
        ctx!.strokeStyle = strand.colour;
        ctx!.lineWidth = strand.width;
        ctx!.stroke();
      }

      ctx!.globalCompositeOperation = "source-over";
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

    function onPointerMove(event: PointerEvent) {
      const box = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.inside = pointer.y >= 0 && pointer.y <= box.height;
      if (!reduced) restart();
    }

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
    };
  }, [reduced, tone, data]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
