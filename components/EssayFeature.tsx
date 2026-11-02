import Link from "next/link";

/**
 * The newest essay on the homepage: a chart panel that overlaps the top of the card,
 * and a glass chip with the key figure. The whole card is one link. Without a chart, the
 * card stands on its own.
 */
export function EssayFeature({
  href,
  meta,
  title,
  summary,
  keyFigure,
  chart,
  chartCaption,
}: {
  href: string;
  meta: string;
  title: string;
  summary: string;
  keyFigure?: { figure: string; label: string };
  chart?: React.ReactNode;
  chartCaption?: string;
}) {
  return (
    <article className="group relative">
      {chart && (
        <div className="relative z-10 mx-3 rounded-card bg-paper px-5 pt-24 pb-5 shadow-e2 md:mx-8 md:px-6 md:pt-14 md:pb-6">
          {/* Sits across the panel's top edge, above the plot, so it never covers data. */}
          {keyFigure && (
            <div
              className={
                "glass absolute -top-6 right-3 left-3 flex items-center gap-4 rounded-inline px-4 py-3 " +
                "md:left-auto md:-right-5 md:max-w-[24rem] " +
                "transition-[background-color] duration-(--dur-hover) ease-out group-is-hover:bg-paper"
              }
            >
              <p className="shrink-0 text-h3">{keyFigure.figure}</p>
              <p className="text-small text-slate">{keyFigure.label}</p>
            </div>
          )}
          {chart}
          {chartCaption && <p className="mt-3 text-small text-muted">{chartCaption}</p>}
        </div>
      )}
      <div
        className={
          (chart ? "-mt-10 pt-16 " : "pt-8 ") +
          "rounded-card bg-paper px-6 pb-8 shadow-e1 md:px-10 " +
          "transition-[translate,box-shadow] duration-(--dur-hover) ease-out " +
          "group-is-hover:-translate-y-0.5 group-is-hover:shadow-e2"
        }
      >
        <p className="text-small text-muted">{meta}</p>
        <h3 className="mt-3 text-h3">
          <Link
            href={href}
            className="rounded-[4px] after:absolute after:inset-0 after:z-20 after:rounded-card"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-3 max-w-[60ch] text-slate">{summary}</p>
        <p aria-hidden className="mt-6 text-small font-semibold text-signal">
          Read the essay
        </p>
      </div>
    </article>
  );
}
