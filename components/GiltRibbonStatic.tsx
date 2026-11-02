import { smoothCurve } from "@/lib/curves";
import gilts from "@/public/data/gilt-curves.json";

/**
 * A still picture of the ribbon for visitors without JavaScript (rendered inside <noscript>):
 * every third day's curve and the latest close in gold, with the same composition and left fade.
 */
const SAMPLES = 36;
const W = 1440;
const H = 900;

export function GiltRibbonStatic() {
  const logs = gilts.maturities.map(Math.log);
  const at = Array.from(
    { length: SAMPLES },
    (_, i) => logs[0] + ((logs[logs.length - 1] - logs[0]) * i) / (SAMPLES - 1),
  );
  const all = gilts.curves.flatMap((c) => c.yields);
  const [low, high] = [Math.min(...all), Math.max(...all)];
  const last = gilts.curves.length - 1;
  const days = gilts.curves
    .map((c, d) => ({ d, yields: smoothCurve(logs, c.yields, at) }))
    .filter(({ d }) => d % 3 === 0 || d === last);

  const path = (yields: number[], age: number) =>
    yields
      .map((y, i) => {
        const back = 1 - age;
        const x = W * (0.3 + (i / (SAMPLES - 1)) * 0.84 + back * 0.08);
        const top = H * (0.94 - ((y - low) / (high - low)) * 0.48 - back * 0.5);
        return `${i ? "L" : "M"}${x.toFixed(1)},${top.toFixed(1)}`;
      })
      .join(" ");

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMaxYMid slice"
      className="absolute inset-0 size-full"
    >
      <defs>
        <linearGradient id="ribbon-fade" x1="0" x2="1">
          <stop offset="0.38" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="ribbon-mask">
          <rect width={W} height={H} fill="url(#ribbon-fade)" />
        </mask>
      </defs>
      <g mask="url(#ribbon-mask)" fill="none">
        {days.map(({ d, yields }) => {
          const age = d / last;
          const latest = d === last;
          return (
            <path
              key={d}
              d={path(yields, age)}
              stroke={latest ? "var(--gilt)" : "var(--signal-soft)"}
              strokeOpacity={latest ? 1 : 0.15 + 0.5 * age}
              strokeWidth={latest ? 2.5 : 1}
            />
          );
        })}
      </g>
    </svg>
  );
}
