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
 * headroom through index-linked gilts alone: two bars on one scale, the extra cost turning gold
 * once it passes the headroom. It sits in the reading column, ruled above and below. The slider
 * announces the full result as its value.
 */
export function HeadroomSlider() {
  const id = useId();
  const [points, setPoints] = useState(1);
  const { cost, over, result } = headroomAfter(points);

  return (
    <figure className="my-12 border-y border-line py-8 font-sans">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-ui font-semibold">
          Extra RPI and CPIH inflation, every year
        </label>
        <output htmlFor={id} className="shrink-0 text-ui text-muted tabular-nums">
          {pointsLabel(points)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={MAX_POINTS}
        step={0.5}
        value={points}
        onChange={(event) => setPoints(Number(event.target.value))}
        aria-valuetext={`${pointsLabel(points)}. Extra deficit ${bn(cost)}. ${result}`}
        style={{ "--fill": `${(points / MAX_POINTS) * 100}%` } as React.CSSProperties}
        className="range w-full"
      />
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
