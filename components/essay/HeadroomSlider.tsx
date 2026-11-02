"use client";

import { useId, useState } from "react";
import { bn, COST_PER_POINT_BN, HEADROOM_BN, headroomAfter } from "@/lib/headroom";
import { cx } from "@/lib/cx";

const MAX_POINTS = 3;
const SCALE = COST_PER_POINT_BN * MAX_POINTS; // both bars share one scale, up to £27bn
const pct = (bnValue: number) => `${(bnValue / SCALE) * 100}%`;
const pointsLabel = (points: number) => `${points} ${points === 1 ? "point" : "points"}`;

/**
 * For "The bill Britain keeps signing": how fast an inflation surprise uses up the fiscal
 * headroom through index-linked gilts alone. The extra cost turns gold once it passes the
 * headroom. The slider announces the full result to screen readers as its value.
 */
export function HeadroomSlider() {
  const id = useId();
  const [points, setPoints] = useState(1);
  const { cost, over, result } = headroomAfter(points);

  return (
    <figure
      data-tone="night"
      className="essay-wide my-14 rounded-card bg-night px-5 py-6 font-sans md:px-10 md:py-9"
    >
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-ui font-semibold">
          Extra RPI and CPIH inflation, every year
        </label>
        <output htmlFor={id} className="shrink-0 text-ui text-night-muted tabular-nums">
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
        className="range-night mt-2 w-full"
      />
      <div aria-hidden className="flex justify-between text-small text-night-muted tabular-nums">
        <span>0</span>
        <span>{MAX_POINTS} points</span>
      </div>

      <div className="mt-8 space-y-5">
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

      <p className="mt-8 text-lead">{result}</p>
      <figcaption className="mt-3 max-w-[60ch] text-small text-night-muted">
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
      <p className="text-small text-night-muted">{label}</p>
      <div className="relative mt-2 h-3 rounded-inline bg-night-line">
        <div
          className={cx(
            "h-full rounded-inline transition-[width,background-color] duration-(--dur-hover) ease-out",
            tone === "neutral"
              ? "bg-night-text/30"
              : tone === "blue"
                ? "bg-signal-soft"
                : "bg-gilt",
          )}
          style={{ width: pct(value) }}
        />
        {/* The headroom, marked on both bars so the comparison is direct. */}
        <span
          aria-hidden
          className="absolute -inset-y-1.5 w-px bg-night-text/50"
          style={{ left: pct(HEADROOM_BN) }}
        />
      </div>
    </div>
  );
}
