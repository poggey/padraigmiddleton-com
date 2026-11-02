// Two epicycles (the first two terms of a square wave's Fourier series) and the wave they trace.
// Pointed at, the circles turn: the outer arm once, the inner one three times as fast.
const [cx, cy] = [17, 32];
const [r1, r3] = [11, 11 / 3];
const wave = Array.from({ length: 41 }, (_, i) => {
  const t = (i / 40) * 2 * Math.PI;
  return `${i ? "L" : "M"}${(34 + (i / 40) * 26).toFixed(1)},${(cy - (r1 * Math.sin(t) + r3 * Math.sin(3 * t))).toFixed(1)}`;
}).join(" ");

export function FourierEmblem() {
  return (
    <>
      <circle cx={cx} cy={cy} r={r1} fill="none" stroke="currentColor" strokeOpacity={0.5} />
      <g transform={`translate(${cx} ${cy})`}>
        <g data-emblem="turn" style={{ "--turns": "-1turn" } as React.CSSProperties}>
          <line x2={r1} stroke="currentColor" />
          <g transform={`translate(${r1} 0)`}>
            <g data-emblem="turn" style={{ "--turns": "-2turn" } as React.CSSProperties}>
              <circle r={r3} fill="none" stroke="currentColor" strokeOpacity={0.5} />
              <line x2={r3} stroke="currentColor" />
              <circle cx={r3} r={1.8} className="fill-gilt" />
            </g>
          </g>
        </g>
      </g>
      <path
        data-draw
        pathLength={1}
        d={wave}
        fill="none"
        className="stroke-gilt"
        strokeWidth={1.25}
      />
    </>
  );
}
