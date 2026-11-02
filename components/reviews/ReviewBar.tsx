import Link from "next/link";
import { proposals, type ProposalSlug } from "@/lib/reviews";

// A small bar fixed to the bottom of every prototype: which one this is, and links to the others.
export function ReviewBar({ current }: { current: ProposalSlug }) {
  const index = proposals.findIndex((p) => p.slug === current);
  const prev = proposals[(index + proposals.length - 1) % proposals.length];
  const next = proposals[(index + 1) % proposals.length];
  const link =
    "rounded-[3px] px-2.5 py-1.5 text-[rgb(255_255_255/0.72)] transition-colors duration-(--dur-hover) is-hover:bg-[rgb(255_255_255/0.1)] is-hover:text-[#fff]";

  return (
    <nav
      aria-label="Design prototypes"
      className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-max max-w-[calc(100%-2rem)] items-center gap-1 overflow-x-auto rounded-[6px] bg-[rgb(17_24_39/0.94)] p-1 font-sans text-small whitespace-nowrap text-[#fff] shadow-[0_12px_32px_-12px_rgb(0_0_0/0.5)] backdrop-blur"
    >
      <Link href="/reviews" className={link}>
        All prototypes
      </Link>
      <span aria-hidden className="h-4 w-px bg-[rgb(255_255_255/0.2)]" />
      <Link href={`/reviews/${prev.slug}`} className={link} aria-label={`Previous: ${prev.name}`}>
        ←
      </Link>
      <span className="px-2 font-semibold">
        {proposals[index].letter}. {proposals[index].name}
      </span>
      <Link href={`/reviews/${next.slug}`} className={link} aria-label={`Next: ${next.name}`}>
        →
      </Link>
      <span aria-hidden className="h-4 w-px bg-[rgb(255_255_255/0.2)]" />
      <Link href="/" className={link}>
        Current site
      </Link>
    </nav>
  );
}
