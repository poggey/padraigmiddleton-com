// A return distribution as a row of bars, its left tail in gold beyond a dashed VaR line. Pointed
// at, the tail stretches: the stress test.
const bars = Array.from({ length: 11 }, (_, i) => {
  const spread = i < 6 ? 2.6 : 1.7; // a longer left tail than right
  return { x: 8 + i * 4.6, h: 2 + 34 * Math.exp(-(((i - 6) / spread) ** 2) / 2) };
});

export function RiskEmblem() {
  return (
    <>
      <line x1={6} x2={58} y1={52.5} y2={52.5} stroke="currentColor" strokeOpacity={0.5} />
      {bars.map(({ x, h }, i) => (
        <rect
          key={x}
          x={x}
          y={52 - h}
          width={2.4}
          height={h}
          data-emblem={i < 2 ? "stretch" : undefined}
          className={i < 2 ? "fill-gilt" : "fill-current"}
        />
      ))}
      <line
        x1={16.5}
        x2={16.5}
        y1={14}
        y2={56}
        className="stroke-gilt"
        strokeWidth={1}
        strokeDasharray="2 2"
      />
    </>
  );
}
