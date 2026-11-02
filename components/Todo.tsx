// A visible note for Padraig on a page, until he decides. Never shipped at launch (Phase 11 check).
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-6 rounded-inline border-l-2 border-gilt bg-gilt/10 px-4 py-3 text-small text-ink">
      <span className="font-semibold">TODO(Padraig): </span>
      {children}
    </aside>
  );
}
