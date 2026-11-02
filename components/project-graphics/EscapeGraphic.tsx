import data from "@/public/data/projects/escape-velocity.json";
import { box, linear, pathOf, type Variant } from "./frame";

// SPCX closing prices from listing, with the IPO price as a dashed line.
export function EscapeGraphic({ variant }: { variant: Variant }) {
  const { w, h, pad, text } = box(variant, 0.62);
  const closes = data.series.map(([, c]) => c as number);
  const x = linear(0, closes.length - 1, pad, w - pad);
  const y = linear(
    Math.min(data.ipoPrice, ...closes) - 10,
    Math.max(...closes) + 10,
    h - pad - text * 1.6,
    pad + text * 2.2,
  );
  const peak = closes.indexOf(Math.max(...closes));

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`SPCX closing price from listing on ${data.series[0][0]} to ${data.series[closes.length - 1][0]}, against the $${data.ipoPrice} IPO price.`}
      className="block h-auto w-full"
    >
      <line
        x1={pad}
        x2={w - pad}
        y1={y(data.ipoPrice)}
        y2={y(data.ipoPrice)}
        className="stroke-gilt"
        strokeDasharray="5 5"
        strokeWidth={1.5}
      />
      <path
        data-draw
        pathLength={1}
        d={pathOf(closes.map((c, i) => [x(i), y(c)]))}
        fill="none"
        className="stroke-signal-soft"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <g data-fade fontSize={text}>
        <text x={w - pad} y={y(data.ipoPrice) + text * 1.4} textAnchor="end" className="fill-gilt">
          ${data.ipoPrice} IPO price
        </text>
        <text x={x(peak) + 6} y={y(closes[peak]) - 6} className="fill-night-text" fontWeight={600}>
          ${closes[peak].toFixed(0)} high close
        </text>
        <text x={pad} y={h - pad} className="fill-night-muted">
          Listing day
        </text>
        <text x={w - pad} y={h - pad} textAnchor="end" className="fill-night-muted">
          {closes.length} trading days
        </text>
      </g>
    </svg>
  );
}
