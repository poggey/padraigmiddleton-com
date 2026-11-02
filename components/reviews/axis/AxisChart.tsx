import { Reveal } from "@/components/Reveal";
import type { ProjectSeries } from "@/components/reviews/projectSeries";

const W = 480;
const H = 270;
const PAD = { left: 40, right: 14, top: 22, bottom: 30 };

const scale = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

/**
 * A project's data in the Axis style: two drawn axes with ticks, a fine ink line, faint dots or
 * bars, and one gold mark. Every project uses exactly this frame, so they read as one family. The
 * line plots in from the left when it comes into view.
 */
export function AxisChart({ series }: { series: ProjectSeries }) {
  const x = scale(series.x[0], series.x[1], PAD.left, W - PAD.right);
  const y = scale(series.y[0], series.y[1], H - PAD.bottom, PAD.top);
  const bottom = H - PAD.bottom;
  // Many bars (Stirling's editions) are drawn as hairline ticks; a few are drawn as columns.
  const many = (series.bars?.length ?? 0) > 40;
  const barWidth = many ? 1 : ((W - PAD.left - PAD.right) / (series.x[1] - series.x[0])) * 0.72;
  const { gold } = series;

  return (
    <Reveal>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={series.summary}
        className="block h-auto w-full font-sans"
      >
        {/* Gridlines at the y ticks, then the two axes with their tick marks. */}
        <g stroke="var(--axis-light-line)">
          {series.yTicks.map((t) => (
            <line key={t.at} x1={PAD.left} x2={W - PAD.right} y1={y(t.at)} y2={y(t.at)} />
          ))}
        </g>
        <g stroke="var(--axis-light-tick)">
          <line x1={PAD.left} x2={W - PAD.right} y1={bottom} y2={bottom} />
          <line x1={PAD.left} x2={PAD.left} y1={PAD.top - 8} y2={bottom} />
          {series.xTicks.map((t) => (
            <line key={t.at} x1={x(t.at)} x2={x(t.at)} y1={bottom} y2={bottom + 5} />
          ))}
          {series.yTicks.map((t) => (
            <line key={t.at} x1={PAD.left - 5} x2={PAD.left} y1={y(t.at)} y2={y(t.at)} />
          ))}
        </g>
        <g fontSize={11} fill="var(--muted)">
          {series.xTicks.map((t, i) => (
            <text
              key={t.at}
              x={x(t.at)}
              y={bottom + 19}
              textAnchor={
                i === 0 && x(t.at) < PAD.left + 20
                  ? "start"
                  : i === series.xTicks.length - 1 && x(t.at) > W - PAD.right - 20
                    ? "end"
                    : "middle"
              }
            >
              {t.label}
            </text>
          ))}
          {series.yTicks.map((t) => (
            <text key={t.at} x={PAD.left - 9} y={y(t.at) + 4} textAnchor="end">
              {t.label}
            </text>
          ))}
        </g>

        {series.dots && (
          <g
            data-fade
            fill="var(--ink)"
            fillOpacity={0.13}
            style={{ "--after": 0 } as React.CSSProperties}
          >
            {series.dots.map(([a, b], i) => (
              <circle key={i} cx={x(a)} cy={y(b)} r={1.4} />
            ))}
          </g>
        )}
        {series.bars && (
          <g>
            {series.bars.map((bar, i) => {
              const isGold = gold.kind === "bar" && gold.index === i;
              return (
                <rect
                  key={i}
                  data-grow
                  style={{ "--i": Math.min(i, 12) } as React.CSSProperties}
                  x={x(bar.at) - barWidth / 2}
                  y={y(bar.value)}
                  width={isGold ? Math.max(barWidth, 2) : barWidth}
                  height={bottom - y(bar.value)}
                  fill={isGold ? "var(--gilt)" : "var(--ink)"}
                  fillOpacity={isGold ? 1 : many ? 0.4 : 0.22}
                />
              );
            })}
          </g>
        )}
        {series.line && (
          <path
            data-draw
            pathLength={1}
            d={series.line
              .map(([a, b], i) => `${i ? "L" : "M"}${x(a).toFixed(1)},${y(b).toFixed(1)}`)
              .join("")}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        )}

        <g data-fade style={{ "--after": 1.6 } as React.CSSProperties}>
          {gold.kind === "point" && (
            <>
              <circle
                cx={x(gold.at[0])}
                cy={y(gold.at[1])}
                r={4.5}
                fill="var(--gilt)"
                stroke="var(--paper)"
                strokeWidth={2}
              />
              <Label
                x={x(gold.at[0])}
                y={y(gold.at[1])}
                text={gold.label}
                below={y(gold.at[1]) > H * 0.55}
              />
            </>
          )}
          {gold.kind === "level" && (
            <>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(gold.y)}
                y2={y(gold.y)}
                stroke="var(--gilt)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <text
                x={W - PAD.right}
                y={y(gold.y) + 16}
                textAnchor="end"
                fontSize={11}
                fontWeight={600}
                fill="var(--gilt-deep, var(--gilt))"
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
                  r={2.8}
                  fill="var(--gilt)"
                  stroke="var(--paper)"
                  strokeWidth={1}
                />
              ))}
              <text
                x={W - PAD.right}
                y={PAD.top}
                textAnchor="end"
                fontSize={11}
                fontWeight={600}
                fill="var(--gilt-deep, var(--gilt))"
              >
                {gold.label}
              </text>
            </>
          )}
          {gold.kind === "bar" && series.bars && (
            <Label
              x={x(series.bars[gold.index].at)}
              y={y(series.bars[gold.index].value)}
              text={gold.label}
            />
          )}
        </g>
      </svg>
    </Reveal>
  );
}

// A gold mark's label: above the mark, kept inside the chart.
function Label({
  x,
  y,
  text,
  below = false,
}: {
  x: number;
  y: number;
  text: string;
  below?: boolean;
}) {
  const anchor = x > W * 0.7 ? "end" : x < W * 0.3 ? "start" : "middle";
  return (
    <text
      x={x}
      y={below ? y + 20 : y - 11}
      textAnchor={anchor}
      fontSize={11}
      fontWeight={600}
      fill="var(--gilt-deep, var(--gilt))"
    >
      {text}
    </text>
  );
}
