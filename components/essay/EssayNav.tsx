import Link from "next/link";
import type { Post } from "@/lib/content";

// The essays either side of this one, and the full list.
export function EssayNav({ newer, older }: { newer?: Post; older?: Post }) {
  const link =
    "rounded-[4px] text-small font-semibold text-signal underline decoration-signal/35 underline-offset-4 is-hover:decoration-signal";
  return (
    <nav aria-label="More essays" className="mt-10 grid gap-6 md:grid-cols-2">
      {older && (
        <Link href={`/writing/${older.slug}`} className="group rounded-[4px]">
          <span className="text-small text-muted">Previous essay</span>
          <span className="mt-1 block font-semibold group-hover:text-signal">{older.title}</span>
        </Link>
      )}
      {newer && (
        <Link
          href={`/writing/${newer.slug}`}
          className="group rounded-[4px] md:col-start-2 md:text-right"
        >
          <span className="text-small text-muted">Next essay</span>
          <span className="mt-1 block font-semibold group-hover:text-signal">{newer.title}</span>
        </Link>
      )}
      <Link
        href="/writing"
        className={`${link} inline-flex min-h-11 items-center justify-self-start md:col-span-2`}
      >
        All essays
      </Link>
    </nav>
  );
}
