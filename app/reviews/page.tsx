import Link from "next/link";
import { proposals } from "@/lib/reviews";

export const metadata = { title: { absolute: "Design prototypes" } };

// The index of prototypes: one line on each, and a link to the live design for comparison.
export default function ReviewsIndex() {
  return (
    <main className="mx-auto max-w-[56rem] px-5 py-20 md:px-8 md:py-28">
      <p className="text-small text-muted">Design prototypes for padraigmiddleton.com</p>
      <h1 className="mt-3 text-title">Four directions</h1>
      <p className="mt-6 max-w-[56ch] text-lead text-slate">
        Each is a full homepage built with the real content, so you can scroll, hover and resize
        them. The current site is unchanged at{" "}
        <Link href="/" className="text-signal underline underline-offset-4">
          the homepage
        </Link>
        . The reasoning for each is in PROPOSITIONS.md.
      </p>

      <ol className="mt-14 border-t border-line">
        {proposals.map((p) => (
          <li key={p.slug} className="border-b border-line">
            <Link
              href={`/reviews/${p.slug}`}
              className="group grid gap-2 py-7 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:items-baseline md:gap-6"
            >
              <span className="text-h3 text-muted">{p.letter}</span>
              <span>
                <span className="block text-h3 transition-colors duration-(--dur-hover) group-is-hover:text-signal">
                  {p.name}
                </span>
                <span className="mt-2 block max-w-[60ch] text-slate">{p.line}</span>
              </span>
              <span className="text-small font-semibold text-signal">Open prototype →</span>
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-10 max-w-[60ch] text-small text-muted">
        D (Folio) isn’t built: its best idea, the essay as a printed first page, is already on the
        current homepage. These pages are hidden from search engines.
      </p>
    </main>
  );
}
