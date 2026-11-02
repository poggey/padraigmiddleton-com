import { Reveal } from "@/components/Reveal";
import type { ProjectSeries } from "@/components/reviews/projectSeries";

const W = 480;
const H = 250;
const PAD = { left: 12, right: 12, top: 12, bottom: 34 };

const scale = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

/**
 * A project's data in the Survey style, like the elevation profile printed under a route on a
 * walking map: a neatline around the panel, a dotted graticule, the ground under the line shaded
 * with fine hachures, and one gold trig point for the thing that matters.
 */
export function ProfileChart({ series, id }: { series: ProjectSeries; id: string }) {
  const x = scale(series.x[0], series.x[1], PAD.left, W - PAD.right);
  const y = scale(series.y[0], series.y[1], H - PAD.bottom, PAD.top);
  const floor = H - PAD.bottom;
  const { gold } = series;
  const many = (series.bars?.length ?? 0) > 40;
  const slot = series.bars ? (W - PAD.left - PAD.right) / (series.x[1] - series.x[0]) : 0;

  const linePath = series.line
    ?.map(([a, b], i) => `${i ? "L" : "M"}${x(a).toFixed(1)},${y(b).toFixed(1)}`)
    .join("");
  const ground =
    series.line && !series.dots
      ? `${linePath}L${x(series.line.at(-1)![0]).toFixed(1)},${floor}L${x(series.line[0][0]).toFixed(1)},${floor}Z`
      : undefined;

  return (
    <Reveal>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={series.summary}
        className="block h-auto w-full font-sans"
      >
        <defs>
          <pattern id={`hachure-${id}`} width={6} height={4} patternUnits="userSpaceOnUse">
            <line x1={0} x2={6} y1={0.5} y2={0.5} stroke="var(--contour)" strokeWidth={0.6} />
          </pattern>
        </defs>

        {/* Neatline and dotted graticule. */}
        <rect
          x={0.5}
          y={0.5}
          width={W - 1}
          height={floor}
          fill="none"
          stroke="var(--line-strong)"
        />
        <g stroke="var(--line-strong)" strokeDasharray="1 3">
          {series.xTicks.map((t) => (
            <line key={t.at} x1={x(t.at)} x2={x(t.at)} y1={1} y2={floor} />
          ))}
          {series.yTicks.map((t) => (
            <line key={t.at} x1={1} x2={W - 1} y1={y(t.at)} y2={y(t.at)} />
          ))}
        </g>
        <g fontSize={10.5} letterSpacing="0.04em" fill="var(--muted)">
          {series.xTicks.map((t) => (
            <text
              key={t.at}
              x={x(t.at)}
              y={floor + 18}
              textAnchor={x(t.at) < W * 0.12 ? "start" : x(t.at) > W * 0.88 ? "end" : "middle"}
            >
              {t.label}
            </text>
          ))}
          {series.yTicks.map((t) => (
            <text key={t.at} x={6} y={y(t.at) - 4}>
              {t.label}
            </text>
          ))}
        </g>

        {ground && (
          <path
            data-fade
            d={ground}
            fill={`url(#hachure-${id})`}
            style={{ "--after": 0.8 } as React.CSSProperties}
          />
        )}
        {series.dots && (
          <g
            data-fade
            fill="var(--slate)"
            fillOpacity={0.3}
            style={{ "--after": 0 } as React.CSSProperties}
          >
            {series.dots.map(([a, b], i) => (
              <circle key={i} cx={x(a)} cy={y(b)} r={1.1} />
            ))}
          </g>
        )}
        {series.bars?.map((bar, i) => {
          const isGold = gold.kind === "bar" && gold.index === i;
          const width = many ? 1 : slot * 0.8;
          return (
            <rect
              key={i}
              data-grow
              style={{ "--i": Math.min(i, 12) } as React.CSSProperties}
              x={x(bar.at) - width / 2}
              y={y(bar.value)}
              width={isGold ? Math.max(width, 2) : width}
              height={floor - y(bar.value)}
              fill={isGold ? "var(--gilt)" : many ? "var(--contour)" : `url(#hachure-${id})`}
              stroke={isGold || many ? "none" : "var(--contour-index)"}
              strokeWidth={0.75}
            />
          );
        })}
        {linePath && (
          <path
            data-draw
            pathLength={1}
            d={linePath}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        )}

        <g data-fade style={{ "--after": 1.6 } as React.CSSProperties}>
          {gold.kind === "point" && <Trig x={x(gold.at[0])} y={y(gold.at[1])} label={gold.label} />}
          {gold.kind === "level" && (
            <>
              <line
                x1={1}
                x2={W - 1}
                y1={y(gold.y)}
                y2={y(gold.y)}
                stroke="var(--gilt)"
                strokeWidth={1.75}
              />
              <text
                x={W - 8}
                y={y(gold.y) - 6}
                textAnchor="end"
                fontSize={11}
                fontWeight={600}
                fill="var(--gilt-deep)"
              >
                {gold.label}
              </text>
            </>
          )}
          {gold.kind === "dots" && (
            <>
              {gold.points.map(([a, b], i) => (
                <circle
                  key={i}
                  cx={x(a)}
                  cy={y(b)}
                  r={2.6}
                  fill="var(--gilt)"
                  stroke="var(--paper)"
                  strokeWidth={1}
                />
              ))}
              <text
                x={W - 8}
                y={PAD.top + 10}
                textAnchor="end"
                fontSize={11}
                fontWeight={600}
                fill="var(--gilt-deep)"
              >
                {gold.label}
              </text>
            </>
          )}
          {gold.kind === "bar" && series.bars && (
            <text
              x={x(series.bars[gold.index].at)}
              y={y(series.bars[gold.index].value) - 8}
              textAnchor={x(series.bars[gold.index].at) > W * 0.7 ? "end" : "middle"}
              fontSize={11}
              fontWeight={600}
              fill="var(--gilt-deep)"
            >
              {gold.label}
            </text>
          )}
        </g>
      </svg>
    </Reveal>
  );
}

// A trig point: the triangle maps use for a surveyed height, with its reading beside it.
function Trig({ x, y, label }: { x: number; y: number; label: string }) {
  const below = y > H * 0.55;
  const anchor = x > W * 0.7 ? "end" : x < W * 0.3 ? "start" : "middle";
  return (
    <>
      <path
        d={`M${x},${y - 6}L${x + 5.5},${y + 3.5}L${x - 5.5},${y + 3.5}Z`}
        fill="var(--gilt)"
        stroke="var(--paper)"
        strokeWidth={1.25}
      />
      <text
        x={x}
        y={below ? y + 20 : y - 11}
        textAnchor={anchor}
        fontSize={11}
        fontWeight={600}
        fill="var(--gilt-deep)"
      >
        {label}
      </text>
    </>
  );
}
