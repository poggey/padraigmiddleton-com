// A stack of numbered editions: two earlier ones behind, the latest in front with its masthead in
// gold, a headline and two columns. Pointed at, the stack fans out.
const sheet = { x: 12, y: 18, width: 34, height: 38 };
const lines = [37, 41, 45, 49];

export function StirlingEmblem() {
  return (
    <>
      {[2, 1].map((depth) => (
        <g
          key={depth}
          data-emblem="fan"
          style={{ "--fan": `${depth * 2}px ${depth * -2}px` } as React.CSSProperties}
        >
          <rect
            {...sheet}
            x={sheet.x + depth * 3}
            y={sheet.y - depth * 3}
            className="fill-night"
            stroke="currentColor"
            strokeOpacity={0.5}
          />
        </g>
      ))}
      <rect {...sheet} className="fill-night" stroke="currentColor" />
      <line x1={16} x2={42} y1={24} y2={24} className="stroke-gilt" strokeWidth={2} />
      <line x1={16} x2={42} y1={27.5} y2={27.5} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={16} x2={36} y1={32} y2={32} stroke="currentColor" strokeWidth={1.6} />
      {lines.map((y) => (
        <g key={y} stroke="currentColor" strokeOpacity={0.5}>
          <line x1={16} x2={27.5} y1={y} y2={y} />
          <line x1={30.5} x2={42} y1={y} y2={y} />
        </g>
      ))}
    </>
  );
}
