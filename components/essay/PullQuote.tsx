// A sentence from the essay, set large. Use sparingly: at most one per essay.
export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-12 font-serif text-pull text-ink italic [&_p]:m-0 [&_p]:text-pull">
      {children}
    </blockquote>
  );
}
