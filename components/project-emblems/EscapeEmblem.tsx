// A rocket leaving orbit: a planet, its parking orbit, and the escape path in gold. Pointed at,
// the path draws out again from the orbit and the craft arrives at the end of it.
const stars = [
  [44, 50],
  [54, 40],
  [30, 14],
  [10, 22],
  [22, 30],
];

export function EscapeEmblem() {
  return (
    <>
      {stars.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={0.8} className="fill-current" fillOpacity={0.6} />
      ))}
      <circle
        cx={16}
        cy={48}
        r={12}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeDasharray="1.5 2.5"
      />
      <circle cx={16} cy={48} r={6.5} fill="none" stroke="currentColor" />
      <path
        data-draw
        data-emblem="draw"
        pathLength={1}
        d="M16,36 C27,36 40,30 54,12"
        fill="none"
        className="stroke-gilt"
        strokeWidth={1.25}
      />
      <circle data-emblem="arrive" cx={54} cy={12} r={2.2} className="fill-gilt" />
    </>
  );
}
