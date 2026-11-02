"use client";

import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { cx } from "@/lib/cx";

export type Point = { label: string; value: number };

/**
 * A line chart that draws in once when 40% visible. The line is SVG; dots and labels are
 * HTML on top so text stays sharp at any width. Forecast years are dashed.
 */
export function LineChart({
  points,
  firstForecast,
  yMax,
  labelled,
  highlight,
  ariaLabel,
  unit = "%",
  className,
}: {
  points: Point[];
  /** Index of the first forecast point, if any. */
  firstForecast?: number;
  yMax: number;
  /** Indexes of points that get a direct label. */
  labelled: number[];
  /** Index of the point that matters, drawn in gold. */
  highlight?: number;
  ariaLabel: string;
  unit?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.4);

  const x = (i: number) => (i / (points.length - 1)) * 100;
  const y = (v: number) => 100 - (v / yMax) * 100;
  const path = (from: number, to: number) =>
    points
      .slice(from, to + 1)
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(from + i)},${y(p.value)}`)
      .join(" ");

  const split = firstForecast === undefined ? points.length - 1 : firstForecast - 1;

  return (
    <div className={className}>
      <div ref={ref} role="img" aria-label={ariaLabel} className="relative pt-6">
        <div className="relative aspect-[4/3] md:aspect-[16/7]">
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            data-revealed={inView}
            className={cx(
              "absolute inset-0 size-full overflow-visible",
              "[clip-path:inset(-10%_101%_-10%_-1%)] transition-[clip-path] duration-(--dur-reveal) ease-out",
              "data-[revealed=true]:[clip-path:inset(-10%_-1%_-10%_-1%)]",
            )}
          >
            <line
              x1="0"
              x2="100"
              y1="100"
              y2="100"
              className="stroke-line-strong"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={path(0, split)}
              fill="none"
              className="stroke-signal"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {firstForecast !== undefined && (
              <path
                d={path(split, points.length - 1)}
                fill="none"
                className="stroke-signal"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
          {labelled.map((i) => (
            <div
              key={i}
              aria-hidden
              className={cx(
                "absolute transition-opacity duration-(--dur-hover) ease-out",
                "delay-(--dur-reveal) reduced:delay-0",
                inView ? "opacity-100" : "opacity-0",
              )}
              style={{ left: `${x(i)}%`, top: `${y(points[i].value)}%` }}
            >
              <span
                className={cx(
                  "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-paper",
                  i === highlight ? "bg-gilt" : "bg-signal",
                )}
              />
              <span
                className={cx(
                  "absolute bottom-2 text-small font-semibold text-ink",
                  i === 0
                    ? "left-0"
                    : i === points.length - 1
                      ? "right-0"
                      : "hidden -translate-x-1/2 md:inline", // no room between the ends on phones
                )}
              >
                {points[i].value.toFixed(1)}
                {unit}
              </span>
            </div>
          ))}
        </div>
        {/* The year under each labelled point, plus where the forecast starts. */}
        <div aria-hidden className="relative mt-2 h-5 text-small whitespace-nowrap text-muted">
          {labelled.map((i) => (
            <span
              key={i}
              className={cx(
                "absolute top-0",
                i === 0
                  ? "left-0"
                  : i === points.length - 1
                    ? "right-0"
                    : "hidden -translate-x-1/2 md:inline", // no room between the ends on phones
              )}
              style={i === 0 || i === points.length - 1 ? undefined : { left: `${x(i)}%` }}
            >
              {points[i].label}
            </span>
          ))}
          {firstForecast !== undefined && (
            <span
              className="absolute top-0 hidden -translate-x-1/2 md:inline"
              style={{ left: `${x(firstForecast)}%` }}
            >
              Forecast from {points[firstForecast].label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
