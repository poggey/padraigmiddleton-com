// The counter-argument, set apart on a raised card. It adds no heading: the essay's own words
// say what it is.
export function WhereIMightBeWrong({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-10 rounded-card bg-paper px-6 py-5 shadow-e1 md:px-8 md:py-6 [&>p:first-child]:mt-0">
      {children}
    </aside>
  );
}
