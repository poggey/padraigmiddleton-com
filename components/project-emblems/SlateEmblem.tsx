// A film slate. Its hinged arm carries gold stripes; pointed at, the arm lifts, and it claps shut
// again when the pointer leaves.
const stripes = (offset: number) =>
  [2, 13, 24, 35].map((x) => `M${x + offset},0 h5 l4,-6 h-5 z`).join(" ");

export function SlateEmblem() {
  return (
    <>
      <rect x={10} y={28} width={44} height={26} fill="none" stroke="currentColor" />
      <line x1={10} x2={54} y1={37} y2={37} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={10} x2={54} y1={45.5} y2={45.5} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={32} x2={32} y1={37} y2={54} stroke="currentColor" strokeOpacity={0.5} />
      <g transform="translate(10 28)">
        <rect y={-6} width={44} height={6} fill="none" stroke="currentColor" />
        <path d={stripes(0)} className="fill-current" fillOpacity={0.45} />
      </g>
      <g transform="translate(10 22)">
        <g data-emblem="lift">
          <rect y={-6} width={44} height={6} className="fill-night" stroke="currentColor" />
          <path d={stripes(0)} className="fill-gilt" />
        </g>
      </g>
    </>
  );
}
