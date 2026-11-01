// Marks a page that only has its shell so far. Removed as each page is built.
export function Stub({ phase }: { phase: number }) {
  return <p className="mt-12 text-small text-muted">This page is a stub until Phase {phase}.</p>;
}
