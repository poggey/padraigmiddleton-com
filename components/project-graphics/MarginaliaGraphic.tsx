import data from "@/public/data/projects/marginalia.json";
import { box, linear, type Variant } from "./frame";

// Predicted ratings with their confidence bands: the recommender's shortlist for its test reader.
export function MarginaliaGraphic({ variant }: { variant: Variant }) {
  const { w, h, pad, text } = box(variant, 0.62);
  const labelWidth = variant === "card" ? 150 : 300;
  const x = linear(1.5, 5, labelWidth + pad, w - pad);
  const row = (h - pad * 2 - text * 2) / data.books.length;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`The recommender's shortlist for its test reader: ${data.books.map((b) => `${b.title}, predicted ${b.predicted} out of 5, plus or minus ${b.band}`).join("; ")}.`}
      className="block h-auto w-full"
    >
      {[2, 3, 4, 5].map((tick) => (
        <g key={tick}>
          <line
            x1={x(tick)}
            x2={x(tick)}
            y1={pad}
            y2={h - pad - text * 1.6}
            className="stroke-night-line"
          />
          <text
            x={x(tick)}
            y={h - pad}
            textAnchor="middle"
            fontSize={text}
            className="fill-night-muted"
          >
            {tick}
          </text>
        </g>
      ))}
      {data.books.map((book, i) => {
        const cy = pad + row * (i + 0.5);
        const best = i === 0;
        return (
          <g key={book.title}>
            <text
              x={pad}
              y={cy + text * 0.35}
              fontSize={text}
              className={best ? "fill-night-text" : "fill-night-muted"}
            >
              {book.title.length > (variant === "card" ? 22 : 44)
                ? `${book.title.slice(0, variant === "card" ? 21 : 43)}…`
                : book.title}
            </text>
            <line
              data-grow
              style={{ "--i": i } as React.CSSProperties}
              x1={x(Math.max(1.5, book.predicted - book.band))}
              x2={x(Math.min(5, book.predicted + book.band))}
              y1={cy}
              y2={cy}
              className={best ? "stroke-gilt" : "stroke-signal-soft"}
              strokeOpacity={0.45}
              strokeWidth={variant === "card" ? 6 : 10}
              strokeLinecap="round"
            />
            <circle
              data-fade
              cx={x(book.predicted)}
              cy={cy}
              r={variant === "card" ? 4 : 6}
              className={best ? "fill-gilt" : "fill-signal-soft"}
            />
          </g>
        );
      })}
    </svg>
  );
}
