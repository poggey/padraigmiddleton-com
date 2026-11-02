import Link from "next/link";
import { buttonClasses, Chevron } from "@/components/Button";
import { Chip } from "@/components/Chip";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";

/**
 * The newest essay as an editorial teaser: the words on the left, its chart as the lead figure
 * on the right. The whole card is one link.
 */
export function EssayTeaser({
  post,
  figure,
  caption,
}: {
  post: Post;
  figure: React.ReactNode;
  caption: string;
}) {
  return (
    <article className="group relative grid overflow-hidden rounded-card bg-paper shadow-e1 transition-shadow duration-(--dur-hover) ease-out is-hover:shadow-e2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col p-7 md:p-10">
        <p className="text-small text-muted">
          <span className="font-semibold text-ink">No. {post.number}</span>,{" "}
          <time dateTime={post.date}>{formatDate(post.date)}</time>, {post.readingMinutes} min read
        </p>
        <h3 className="mt-5 text-h2">
          <Link
            href={`/writing/${post.slug}`}
            className="rounded-[4px] decoration-signal/40 decoration-2 underline-offset-[6px] group-is-hover:underline after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-5 max-w-[36ch] font-serif text-essay-dek text-slate">{post.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
        <div aria-hidden className="mt-10 lg:mt-auto lg:pt-10">
          <span className={buttonClasses()}>
            Read the essay
            <Chevron />
          </span>
        </div>
      </div>
      <figure className="border-t border-line p-6 md:p-10 lg:border-t-0 lg:border-l">
        {figure}
        <figcaption className="mt-3 text-small text-muted">{caption}</figcaption>
      </figure>
    </article>
  );
}
