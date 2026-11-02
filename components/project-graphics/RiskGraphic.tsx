import data from "@/public/data/projects/risk-dashboard.json";
import { box, linear, pathOf, type Variant } from "./frame";

const pct = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v * 100).toFixed(1)}%`;

// Cumulative return of the dashboard's Multi-Asset preset, with the maximum drawdown in gold.
export function RiskGraphic({ variant }: { variant: Variant }) {
  const { w, h, pad, text } = box(variant, 0.62);
  const values = data.series.map(([, v]) => v as number);
  const x = linear(0, values.length - 1, pad, w - pad);
  const y = linear(
    Math.min(...values, 0) - 0.02,
    Math.max(...values) + 0.04,
    h - pad - text * 1.6,
    pad + text * 2,
  );
  const index = (date: string) => data.series.findIndex(([d]) => (d as string) >= date);
  const [from, to] = [index(data.drawdown.from), index(data.drawdown.to)];
  const last = values.length - 1;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`Cumulative return of the Multi-Asset preset, ${data.from.slice(0, 4)} to ${data.to.slice(0, 4)}: ${pct(values[last])}. The worst fall from a peak was ${pct(data.drawdown.depth)}, shaded in gold.`}
      className="block h-auto w-full"
    >
      <line
        x1={pad}
        x2={w - pad}
        y1={y(0)}
        y2={y(0)}
        className="stroke-night-line-strong"
        strokeDasharray="2 4"
      />
      <path
        data-draw
        pathLength={1}
        d={pathOf(values.map((v, i) => [x(i), y(v)]))}
        fill="none"
        className="stroke-signal-soft"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        data-draw
        pathLength={1}
        d={pathOf(values.slice(from, to + 1).map((v, i) => [x(from + i), y(v)]))}
        fill="none"
        className="stroke-gilt"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <g data-fade className="fill-night-muted" fontSize={text}>
        <text x={x(from)} y={y(Math.max(...values.slice(from, to + 1))) - 10} className="fill-gilt">
          Max drawdown {pct(data.drawdown.depth)}
        </text>
        <text
          x={w - pad}
          y={y(Math.max(...values)) - 8}
          textAnchor="end"
          className="fill-night-text"
          fontWeight={600}
        >
          {pct(values[last])}
        </text>
        <text x={pad} y={h - pad}>
          {data.from.slice(0, 4)}
        </text>
        <text x={w - pad} y={h - pad} textAnchor="end">
          95% one-day VaR {pct(data.var95)}
        </text>
      </g>
    </svg>
  );
}
