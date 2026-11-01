"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionConfig } from "motion/react";
import gilts from "@/public/data/gilt-curves.json";
import { smoothCurve } from "@/lib/curves";
import { cx } from "@/lib/cx";
import styles from "./CurveScrubber.module.css";

/**
 * One large gilt yield curve. On load it replays the last 60 trading days and settles on the
 * latest close, in gold. The timeline underneath moves through the days by drag or arrow keys.
 * Faint lines behind show every day at once, so the range of movement is always visible.
 */

const SAMPLES = 96;
const LOGS = gilts.maturities.map(Math.log);
const AT = Array.from(
  { length: SAMPLES },
  (_, i) => LOGS[0] + ((LOGS[LOGS.length - 1] - LOGS[0]) * i) / (SAMPLES - 1),
);
const CURVES = gilts.curves.map((c) => smoothCurve(LOGS, c.yields, AT));
const LAST = CURVES.length - 1;
const ALL = gilts.curves.flatMap((c) => c.yields);
const Y_MIN = Math.floor(Math.min(...ALL) * 2) / 2;
const Y_MAX = Math.ceil(Math.max(...ALL) * 2) / 2;
const GRID = Array.from({ length: (Y_MAX - Y_MIN) * 2 + 1 }, (_, i) => Y_MIN + i * 0.5);
const TICKS = [1, 2, 5, 10, 30];

const x = (logMaturity: number) =>
  ((logMaturity - LOGS[0]) / (LOGS[LOGS.length - 1] - LOGS[0])) * 100;
const y = (value: number) => 100 - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * 100;

function path(values: number[]) {
  return values.map((v, i) => `${i ? "L" : "M"}${(i / (SAMPLES - 1)) * 100},${y(v)}`).join(" ");
}

function blend(position: number) {
  const day = Math.min(LAST - 1, Math.floor(position));
  const t = position - day;
  return CURVES[day].map((v, i) => v + (CURVES[day + 1][i] - v) * t);
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

function yieldAt(day: number, maturity: number) {
  return gilts.curves[day].yields[gilts.maturities.indexOf(maturity)].toFixed(2);
}

export function CurveScrubber({ className }: { className?: string }) {
  const reduced = useReducedMotionConfig() ?? false;
  const [target, setTarget] = useState(reduced ? LAST : 0);
  const [shown, setShown] = useState(reduced ? LAST : 0);
  const playing = useRef(!reduced);

  // Replay: move the target from the oldest day to the latest over three seconds.
  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function play(now) {
      if (!playing.current) return;
      const t = Math.min(1, (now - start) / 3000);
      setTarget(LAST * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(play);
    });
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  // The drawn curve eases towards the target, so dragging between days morphs smoothly.
  useEffect(() => {
    if (reduced) {
      setShown(target);
      return;
    }
    let frame = requestAnimationFrame(function ease() {
      setShown((current) => {
        const next = current + (target - current) * 0.22;
        if (Math.abs(target - next) > 0.002) frame = requestAnimationFrame(ease);
        return Math.abs(target - next) > 0.002 ? next : target;
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [target, reduced]);

  const day = Math.round(shown);
  const latest = day === LAST && Math.abs(shown - LAST) < 0.05;
  const date = formatDate(gilts.curves[day].date);

  return (
    <div className={className}>
      <div aria-live="off">
        <p className="text-h3">{date}</p>
        <p className="mt-1 text-small text-slate">
          2-year {yieldAt(day, 2)}%, 10-year {yieldAt(day, 10)}%, 30-year {yieldAt(day, 30)}%
          {latest ? ". The latest close." : "."}
        </p>
      </div>

      <div
        role="img"
        aria-label={`UK gilt yield curve on ${date}: 2-year ${yieldAt(day, 2)}%, 10-year ${yieldAt(day, 10)}%, 30-year ${yieldAt(day, 30)}%.`}
        className="relative mt-8 aspect-[4/3] md:aspect-[16/10]"
      >
        {GRID.map((g) => (
          <div
            key={g}
            aria-hidden
            className="absolute inset-x-0 border-t border-line"
            style={{ top: `${y(g)}%` }}
          >
            <span className="absolute -top-2.5 right-full mr-3 text-small text-muted">
              {g.toFixed(1)}%
            </span>
          </div>
        ))}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          {CURVES.map((c, i) => (
            <path
              key={i}
              d={path(c)}
              fill="none"
              className="stroke-line-strong"
              strokeOpacity={0.45}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path
            d={path(blend(shown))}
            fill="none"
            className={cx(
              "transition-[stroke] duration-(--dur-ui)",
              latest ? "stroke-gilt" : "stroke-signal",
            )}
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {TICKS.map((m) => (
          <span
            key={m}
            aria-hidden
            className={cx(
              "absolute top-full mt-2 text-small whitespace-nowrap text-muted",
              m === 30 ? "-translate-x-full" : "-translate-x-1/2",
            )}
            style={{ left: `${x(Math.log(m))}%` }}
          >
            {m === 30 ? "30 years" : m}
          </span>
        ))}
      </div>

      <div className="mt-12">
        <label htmlFor="curve-day" className="sr-only">
          Choose a trading day
        </label>
        <input
          id="curve-day"
          type="range"
          min={0}
          max={LAST}
          step={1}
          value={Math.round(target)}
          aria-valuetext={formatDate(gilts.curves[Math.round(target)].date)}
          onChange={(event) => {
            playing.current = false;
            setTarget(Number(event.target.value));
          }}
          onPointerDown={() => {
            playing.current = false;
          }}
          className={styles.range}
        />
        <div aria-hidden className="flex justify-between text-small text-muted">
          <span>{formatDate(gilts.curves[0].date)}</span>
          <span className="hidden md:inline">Drag to move through 60 trading days</span>
          <span>{formatDate(gilts.asOf)}</span>
        </div>
      </div>
    </div>
  );
}
