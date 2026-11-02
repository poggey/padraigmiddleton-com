import data from "@/public/data/projects/the-slate.json";
import { box, linear, type Variant } from "./frame";

// Distribution of returns across the core sample; bins holding the five biggest earners in gold.
export function SlateGraphic({ variant }: { variant: Variant }) {
  const { w, h, pad, text } = box(variant, 0.62);
  const max = Math.max(...data.bins.map((b) => b.count));
  const slot = (w - pad * 2) / data.bins.length;
  const y = linear(0, max, h - pad - text * 1.6, pad + text * 2.2);
  const base = y(0);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`Returns of ${data.films} films: most lost money (median ${data.medianRoi}%), and a long tail of winners. The five films that earned about 65% of all profit are in gold: ${data.topFive.join(", ")}.`}
      className="block h-auto w-full"
    >
      {data.bins.map((bin, i) => {
        const top = bin.top.length > 0;
        return (
          <rect
            key={bin.from}
            data-grow
            style={{ "--i": i } as React.CSSProperties}
            x={pad + i * slot + slot * 0.12}
            y={y(bin.count)}
            width={slot * 0.76}
            height={base - y(bin.count)}
            rx={variant === "card" ? 3 : 6}
            className={top ? "fill-gilt" : "fill-signal-soft"}
            fillOpacity={top ? 1 : 0.55}
          />
        );
      })}
      <line x1={pad} x2={w - pad} y1={base} y2={base} className="stroke-night-line-strong" />
      <g data-fade className="fill-night-muted" fontSize={text}>
        <text x={pad} y={pad + text}>
          Median return {data.medianRoi}%
        </text>
        <text x={w - pad} y={pad + text} textAnchor="end" className="fill-gilt">
          Five films, about 65% of profit
        </text>
        <text x={pad} y={h - pad}>
          Lost money
        </text>
        <text x={w - pad} y={h - pad} textAnchor="end">
          Made 8× or more
        </text>
      </g>
    </svg>
  );
}
