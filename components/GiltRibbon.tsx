"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionConfig } from "motion/react";
import gilts from "@/public/data/gilt-curves.json";

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
const LOG_MIN = Math.log(gilts.maturities[0]);
const LOG_MAX = Math.log(gilts.maturities[gilts.maturities.length - 1]);

type Strand = { age: number; yields: number[]; colour: string; wash: string; width: number };

// Monotone cubic interpolation (Fritsch–Carlson): a smooth curve that never overshoots the data.
function smoothCurve(xs: number[], ys: number[], at: number[]) {
  const n = xs.length;
  const slope = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]));
  const tangent = xs.map((_, i) => {
    if (i === 0) return slope[0];
    if (i === n - 1) return slope[n - 2];
    return slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  });
  return at.map((x) => {
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * tangent[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * tangent[i + 1]
    );
  });
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

function buildStrands(blend: number): Strand[] {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string) => hexToRgb(style.getPropertyValue(name));
  const stops = ["--ribbon-back", "--ribbon-iris", "--ribbon-mid", "--ribbon-front"].map(token);
  const gold = style.getPropertyValue("--gilt").trim();

  const logs = gilts.maturities.map(Math.log);
  const at = Array.from(
    { length: SAMPLES },
    (_, i) => LOG_MIN + ((LOG_MAX - LOG_MIN) * i) / (SAMPLES - 1),
  );
  const days = gilts.curves.map((c) => smoothCurve(logs, c.yields, at));

  const strands: Strand[] = [];
  const total = (days.length - 1) * blend;
  for (let s = 0; s < total; s++) {
    const day = Math.floor(s / blend);
    const t = (s % blend) / blend;
    const age = s / total;
    strands.push({
      age,
      yields: days[day].map((y, i) => y + (days[day + 1][i] - y) * t),
      colour: rampColour(stops, age, 0.12 + 0.34 * age),
      wash: rampColour(stops, age, 0.035),
      width: 0.9 + 0.5 * age,
    });
  }
  strands.push({ age: 1, yields: days[days.length - 1], colour: gold, wash: "", width: 2.5 });
  return strands;
}

export function GiltRibbon({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Follows the visitor setting, and the /lab simulation switch via MotionConfig.
  const reduced = useReducedMotionConfig() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const strands = buildStrands(coarse ? 1 : 4);
    const all = gilts.curves.flatMap((c) => c.yields);
    const yMin = Math.min(...all);
    const yMax = Math.max(...all);

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    // Adaptive quality: if the first second runs slowly, draw half the strands and no wash.
    let lite = false;
    let lastFrame = 0;
    const frameTimes: number[] = [];
    const start = performance.now();
    const pointer = { x: -1e4, y: -1e4, strength: 0, inside: false };

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
      // Composition: the sheet sweeps up from the lower middle to the top right, behind the
      // cards, clear of the headline column. On phones it sits across the top, behind the text.
      const narrow = width < 1024;
      const originX = width * (narrow ? -0.15 : 0.3);
      const spanX = width * (narrow ? 1.4 : 0.84);
      const baseY = height * (narrow ? 0.5 : 0.94);
      const rise = height * (narrow ? 0.22 : 0.48);
      const depthX = width * (narrow ? 0.12 : 0.08);
      const depthY = height * (narrow ? 0.3 : 0.5);
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
        const washed = !narrow && !lite && strand.wash && s % 6 === 0;
        ctx!.beginPath();
        for (let i = 0; i < count; i++) {
          const u = i / (SAMPLES - 1);
          let x = originX + u * spanX + back * depthX;
          let y =
            baseY -
            ((strand.yields[i] - yMin) / (yMax - yMin)) * rise -
            back * depthY +
            ripple * Math.sin(u * 4.2 + strand.age * 6.5 + time * 0.32) * (0.4 + 0.6 * u);

          if (pointer.strength > 0.01) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 160) {
              const push = (1 - d / 160) ** 2 * 26 * pointer.strength;
              x += (dx / (d || 1)) * push * 0.4;
              y += (dy / (d || 1)) * push;
            }
          }
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        // A wide, faint stroke under every sixth strand gives the sheet a soft body of colour.
        if (washed) {
          ctx!.strokeStyle = strand.wash;
          ctx!.lineWidth = 28;
          ctx!.stroke();
        }
        ctx!.strokeStyle = strand.colour;
        ctx!.lineWidth = strand.width;
        ctx!.stroke();
      }

      // Fade the field out on the left so the headline always sits on a clean ground.
      if (!narrow) {
        const fadeEnd = width * 0.62;
        const fade = ctx!.createLinearGradient(width * 0.38, 0, fadeEnd, 0);
        fade.addColorStop(0, "rgb(0 0 0 / 1)");
        fade.addColorStop(1, "rgb(0 0 0 / 0)");
        ctx!.globalCompositeOperation = "destination-out";
        ctx!.fillStyle = fade;
        ctx!.fillRect(0, 0, fadeEnd, height);
        ctx!.globalCompositeOperation = "source-over";
      }

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
    if (!coarse && !reduced) window.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
