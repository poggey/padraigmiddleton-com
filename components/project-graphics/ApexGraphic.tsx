import data from "@/public/data/projects/apex.json";
import { box, linear, type Variant } from "./frame";

// The teammate network: drivers linked when they shared a car-season. One connected piece.
export function ApexGraphic({ variant }: { variant: Variant }) {
  const { w, h, pad, text } = box(variant, 0.62);
  const x = linear(0, 1, pad * 2, w - pad * 2);
  const y = linear(0, 1, pad * 1.5, h - pad * 2 - text);
  const top = [...data.nodes].sort((a, b) => b.skill - a.skill)[0];
  const r = variant === "card" ? 3.2 : 5;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`${data.nodes.length} Formula 1 drivers joined by ${data.edges.length} links where two of them shared a car in the same season, forming one connected network from 2018 to 2024. That is what lets the model separate driver from car.`}
      className="block h-auto w-full"
    >
      <g
        data-fade
        style={{ "--after": 0 } as React.CSSProperties}
        className="stroke-night-line-strong"
      >
        {data.edges.map(([a, b, weight], i) => (
          <line
            key={i}
            x1={x(data.nodes[a as number].x)}
            y1={y(data.nodes[a as number].y)}
            x2={x(data.nodes[b as number].x)}
            y2={y(data.nodes[b as number].y)}
            strokeWidth={0.8 + 0.6 * ((weight as number) - 1)}
          />
        ))}
      </g>
      <g data-fade style={{ "--after": 0.6 } as React.CSSProperties}>
        {data.nodes.map((node) => (
          <circle
            key={node.code}
            cx={x(node.x)}
            cy={y(node.y)}
            r={node.code === top.code ? r * 1.6 : r}
            className={node.code === top.code ? "fill-gilt" : "fill-signal-soft"}
          />
        ))}
        {variant === "page" &&
          data.nodes.map((node) => (
            <text
              key={node.code}
              x={x(node.x) + r + 3}
              y={y(node.y) + 4}
              fontSize={text - 2}
              className="fill-night-muted"
            >
              {node.code}
            </text>
          ))}
      </g>
      <g data-fade className="fill-night-muted" fontSize={text}>
        <text x={pad} y={h - pad}>
          {data.nodes.length} drivers, {data.edges.length} shared cars
        </text>
        <text x={w - pad} y={h - pad} textAnchor="end" className="fill-gilt">
          Highest rated: {top.name}
        </text>
      </g>
    </svg>
  );
}
