// The numbered list of sources at the end of an essay, built from its footnotes.
export function Sources({ children }: { children: React.ReactNode }) {
  return (
    <section aria-labelledby="sources-heading" className="mt-16">
      <h2 id="sources-heading" className="text-ui font-semibold">
        Sources
      </h2>
      <div className="mt-4 font-sans text-small text-slate [&_li]:pl-1 [&_li+li]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:marker:text-muted [&_p]:mt-0 [&_p]:text-small">
        {children}
      </div>
    </section>
  );
}
