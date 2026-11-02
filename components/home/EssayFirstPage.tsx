import Link from "next/link";
import { buttonClasses, Chevron } from "@/components/Button";
import { Chip } from "@/components/Chip";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";

/**
 * The newest essay as its own first page: set like the top of the essay itself (number and tags,
 * title, standfirst, byline), then the opening paragraph fading out, and "Read the essay". The
 * whole sheet is one link.
 */
export function EssayFirstPage({ post, opening }: { post: Post; opening: string }) {
  return (
    <article className="group relative overflow-hidden rounded-card bg-paper shadow-e1 transition-shadow duration-(--dur-hover) ease-out is-hover:shadow-e2">
      <div className="mx-auto max-w-essay px-6 pt-12 text-center md:pt-16">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-small font-semibold">No. {post.number}</span>
          {post.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
        <h3 className="mt-6 text-h2">
          <Link
            href={`/writing/${post.slug}`}
            className="rounded-[4px] decoration-signal/40 decoration-2 underline-offset-[6px] group-is-hover:underline after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mx-auto mt-5 max-w-[40ch] font-serif text-essay-dek text-slate">
          {post.summary}
        </p>
        <p className="mt-6 text-small text-muted">
          Padraig Middleton, <time dateTime={post.date}>{formatDate(post.date)}</time>,{" "}
          {post.readingMinutes} min read
        </p>
      </div>
      {/* The opening, cut off mid-thought so it reads as the start of something longer. */}
      <div aria-hidden className="relative mx-auto mt-10 max-w-essay px-6">
        <p className="h-[8.75em] overflow-hidden font-serif text-essay-body">{opening}</p>
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-paper to-transparent" />
      </div>
      <div aria-hidden className="flex justify-center pt-2 pb-12">
        <span className={buttonClasses()}>
          Read the essay
          <Chevron />
        </span>
      </div>
    </article>
  );
}
