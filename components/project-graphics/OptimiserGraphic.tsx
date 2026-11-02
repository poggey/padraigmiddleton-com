import data from "@/public/data/projects/portfolio-optimiser.json";
import { box, linear, pathOf, type Variant } from "./frame";

// 800 of the 10,000 random portfolios, the efficient frontier, and the maximum-Sharpe portfolio.
export function OptimiserGraphic({ variant }: { variant: Variant }) {
  const { w, h, pad, text } = box(variant, 0.62);
  const vols = [...data.cloud.map(([v]) => v), ...data.frontier.map(([v]) => v)];
  const rets = [...data.cloud.map(([, r]) => r), ...data.frontier.map(([, r]) => r)];
  const x = linear(Math.min(...vols), Math.max(...vols), pad, w - pad);
  const y = linear(Math.min(...rets), Math.max(...rets), h - pad - text * 1.6, pad + text * 1.4);
  const r = variant === "card" ? 1.3 : 2;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`Ten thousand random portfolios of eight ETFs, the efficient frontier above them, and the maximum-Sharpe portfolio in gold: Sharpe ratio ${data.maxSharpe.sharpe}.`}
      className="block h-auto w-full"
    >
      <g
        data-fade
        style={{ "--after": 0 } as React.CSSProperties}
        className="fill-signal-soft"
        fillOpacity={0.35}
      >
        {data.cloud.map(([v, ret], i) => (
          <circle key={i} cx={x(v)} cy={y(ret)} r={r} />
        ))}
      </g>
      <path
        data-draw
        pathLength={1}
        d={pathOf(data.frontier.map(([v, ret]) => [x(v), y(ret)]))}
        fill="none"
        className="stroke-night-text"
        strokeWidth={2}
      />
      <g data-fade style={{ "--after": 1.6 } as React.CSSProperties}>
        <circle
          cx={x(data.maxSharpe.vol)}
          cy={y(data.maxSharpe.ret)}
          r={r * 4}
          className="fill-gilt stroke-night"
          strokeWidth={2}
        />
        <text
          x={x(data.maxSharpe.vol)}
          y={y(data.maxSharpe.ret) + text * 2}
          textAnchor="middle"
          fontSize={text}
          className="fill-gilt"
          fontWeight={600}
        >
          Max Sharpe {data.maxSharpe.sharpe.toFixed(2)}
        </text>
      </g>
      <g data-fade className="fill-night-muted" fontSize={text}>
        <text x={pad} y={pad + text * 0.4}>
          Return
        </text>
        <text x={w - pad} y={h - pad} textAnchor="end">
          Volatility
        </text>
      </g>
    </svg>
  );
}
