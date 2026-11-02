import data from "@/public/data/projects/fourier-option-pricing.json";
import { box, linear, pathOf, type Variant } from "./frame";

// "6e-14" as "6 × 10⁻¹⁴".
const superscript = (n: number) =>
  String(n).replace(/[-0-9]/g, (c) => "⁻⁰¹²³⁴⁵⁶⁷⁸⁹"["-0123456789".indexOf(c)]);
const [mantissa, exponent] = data.maxGap.toExponential(0).split("e");
const gap = `${mantissa} × 10${superscript(Number(exponent))}`;

/**
 * The call price at every fifth FFT grid strike from 50 to 200: the Black-Scholes formula as a
 * line, the FFT prices as gold dots sitting on it. Strikes are on a log scale, as the FFT grid is
 * evenly spaced in log strike.
 */
export function FourierGraphic({ variant }: { variant: Variant }) {
  const { w, h, pad, text } = box(variant, 0.62);
  const x = linear(Math.log(50), Math.log(200), pad, w - pad);
  const y = linear(
    0,
    Math.max(...data.points.map(([, , exact]) => exact)),
    h - pad - text * 1.6,
    pad + text * 2.6,
  );
  const r = variant === "card" ? 2.2 : 3;
  // On cards every other point, so the dots stay distinct at that size.
  const dots = variant === "card" ? data.points.filter((_, i) => i % 2 === 0) : data.points;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`Call prices at strikes from 50 to 200. The FFT prices, in gold, sit on the Black-Scholes curve: across all ${data.gridStrikes} grid strikes the largest gap is ${gap}.`}
      className="block h-auto w-full"
    >
      <line
        x1={pad}
        x2={w - pad}
        y1={y(0)}
        y2={y(0)}
        className="stroke-night-line-strong"
        strokeWidth={1}
      />
      <path
        data-draw
        pathLength={1}
        d={pathOf(data.points.map(([k, , exact]) => [x(Math.log(k)), y(exact)]))}
        fill="none"
        className="stroke-night-text"
        strokeWidth={2}
      />
      <g data-fade style={{ "--after": 1.4 } as React.CSSProperties} className="fill-gilt">
        {dots.map(([k, fft]) => (
          <circle key={k} cx={x(Math.log(k))} cy={y(fft)} r={r} />
        ))}
      </g>
      <g data-fade fontSize={text}>
        <text x={pad} y={pad + text * 0.4} className="fill-night-muted">
          Call price
        </text>
        <text
          x={w - pad}
          y={pad + text * 0.4}
          textAnchor="end"
          className="fill-gilt"
          fontWeight={600}
        >
          Largest gap from Black-Scholes: {gap}
        </text>
        <text x={pad} y={h - pad} className="fill-night-muted">
          Strike 50
        </text>
        <text x={w - pad} y={h - pad} textAnchor="end" className="fill-night-muted">
          200
        </text>
      </g>
    </svg>
  );
}
