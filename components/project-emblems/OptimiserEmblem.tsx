// The efficient frontier as a bullet of possible portfolios, with the capital market line from the
// risk-free rate touching it at the maximum Sharpe portfolio (gold). Pointed at, the line sweeps
// up from below until it finds the tangent.
const toX = (risk: number) => 10 + risk * 38;
const toY = (ret: number) => 32 - ret * 20;
const riskOf = (ret: number) => Math.sqrt(0.16 + 0.9 * ret ** 2);
const riskFree = -0.5;

const frontier = Array.from({ length: 41 }, (_, i) => -1 + i / 20).map((ret) => ({
  ret,
  x: toX(riskOf(ret)),
  y: toY(ret),
}));
// The tangent touches the frontier where return per unit of risk is greatest.
const best = frontier.reduce((a, b) =>
  (b.ret - riskFree) / riskOf(b.ret) > (a.ret - riskFree) / riskOf(a.ret) ? b : a,
);
const [x0, y0] = [toX(0), toY(riskFree)];
const angle = Math.atan2(best.y - y0, best.x - x0);
const path = frontier
  .map(({ x, y }, i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
  .join(" ");
const assets = [
  [33, 31],
  [38, 22],
  [42, 37],
  [47, 28],
  [41, 45],
];

export function OptimiserEmblem() {
  return (
    <>
      <path d={path} fill="none" stroke="currentColor" />
      {assets.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={1.2} className="fill-current" fillOpacity={0.6} />
      ))}
      <g transform={`translate(${x0} ${y0}) rotate(${(angle * 180) / Math.PI})`}>
        <g data-emblem="sweep" style={{ "--from": "16deg" } as React.CSSProperties}>
          <line x2={54} className="stroke-gilt" strokeDasharray="2 2" />
        </g>
      </g>
      <circle cx={x0} cy={y0} r={1.6} className="fill-current" />
      <circle data-emblem="arrive" cx={best.x} cy={best.y} r={2.2} className="fill-gilt" />
    </>
  );
}
