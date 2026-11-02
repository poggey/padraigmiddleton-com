"use client";

import { useId, useState } from "react";
import { bn, COST_PER_POINT_BN, HEADROOM_BN, headroomAfter } from "@/lib/headroom";
import { cx } from "@/lib/cx";

const MAX_POINTS = 3;
const SCALE = COST_PER_POINT_BN * MAX_POINTS; // the bars run to £27bn
const pct = (bnValue: number) => `${(bnValue / SCALE) * 100}%`;
const pointsLabel = (points: number) => `${points} ${points === 1 ? "point" : "points"}`;

/**
 * For "The bill Britain keeps signing": how fast an inflation surprise uses up the fiscal
 * headroom through index-linked gilts alone. It sits in the reading column, ruled above and below.
 * "sentence" reads as a sentence whose numbers move with the slider, over one bar marked at the
 * headroom; "bars" compares two bars. The slider announces the full result as its value.
 */
export function HeadroomSlider({ variant = "sentence" }: { variant?: "sentence" | "bars" }) {
  const id = useId();
  const [points, setPoints] = useState(1);
  const { cost, over, result } = headroomAfter(points);

  const slider = (
    <input
      id={id}
      type="range"
      min={0}
      max={MAX_POINTS}
      step={0.5}
      value={points}
      onChange={(event) => setPoints(Number(event.target.value))}
      aria-valuetext={`${pointsLabel(points)}. Extra deficit ${bn(cost)}. ${result}`}
      style={
        {
          "--fill": `${(points / MAX_POINTS) * 100}%`,
          ...(over && variant === "sentence" ? { "--range-fill": "var(--gilt)" } : {}),
        } as React.CSSProperties
      }
      className="range w-full"
    />
  );

  return (
    <figure className="my-12 border-y border-line py-8 font-sans">
      {variant === "sentence" ? (
        <>
          <p aria-hidden className="font-serif text-essay-body">
            If RPI and CPIH inflation ran{" "}
            <strong className="font-semibold text-signal tabular-nums">
              {pointsLabel(points)}
            </strong>{" "}
            higher every year, linkers alone would add{" "}
            <strong
              className={cx("font-semibold tabular-nums", over ? "text-gilt-deep" : "text-ink")}
            >
              {bn(cost)}
            </strong>{" "}
            to the deficit in 2029–30, against headroom of {bn(HEADROOM_BN)}.
          </p>
          <label htmlFor={id} className="mt-6 block text-small font-semibold">
            Extra RPI and CPIH inflation, every year
          </label>
          {/* The slider is the bar: its scale runs to £27bn, so the headroom sits at £15bn on it. */}
          <div className="relative">
            {slider}
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 h-5 w-px -translate-y-1/2 bg-ink"
              style={{ left: pct(HEADROOM_BN) }}
            />
            <span
              aria-hidden
              className="absolute top-full -mt-1 -translate-x-1/2 text-small whitespace-nowrap text-muted"
              style={{ left: pct(HEADROOM_BN) }}
            >
              Headroom {bn(HEADROOM_BN)}
            </span>
          </div>
          <p className="mt-12 text-lead font-semibold">{result}</p>
        </>
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={id} className="text-ui font-semibold">
              Extra RPI and CPIH inflation, every year
            </label>
            <output htmlFor={id} className="shrink-0 text-ui text-muted tabular-nums">
              {pointsLabel(points)}
            </output>
          </div>
          {slider}
          <div className="mt-6 space-y-5">
            <Bar
              label={`Fiscal headroom, 2029–30: ${bn(HEADROOM_BN)}`}
              value={HEADROOM_BN}
              tone="neutral"
            />
            <Bar
              label={`Extra deficit from linkers alone: ${bn(cost)}`}
              value={cost}
              tone={over ? "gold" : "blue"}
            />
          </div>
          <p className="mt-8 text-lead font-semibold">{result}</p>
        </>
      )}
      <figcaption className="mt-3 text-small text-muted">
        Scaled linearly from the OBR’s estimate that a one-point rise adds £9bn in 2029–30. An
        illustration, not a forecast.
      </figcaption>
    </figure>
  );
}

function Bar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "blue" | "gold";
}) {
  return (
    <div>
      <p className="text-small text-slate">{label}</p>
      <div className="relative mt-2 h-2 rounded-inline bg-line">
        <div
          className={cx(
            "h-full rounded-inline transition-[width,background-color] duration-(--dur-hover) ease-out",
            tone === "neutral" ? "bg-line-strong" : tone === "blue" ? "bg-signal" : "bg-gilt",
          )}
          style={{ width: pct(value) }}
        />
        <span
          aria-hidden
          className="absolute -inset-y-1.5 w-px bg-ink/50"
          style={{ left: pct(HEADROOM_BN) }}
        />
      </div>
    </div>
  );
}
