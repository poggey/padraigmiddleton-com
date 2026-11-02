import Link from "next/link";
import { Chip } from "@/components/Chip";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";

// One essay in the list on /writing: a ruled row with the number and date on the left, the title,
// standfirst and tags on the right. The whole row is the link.
export function EssayRow({ post }: { post: Post }) {
  return (
    <article className="group relative grid gap-3 border-b border-line py-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8 md:py-10">
      <p className="text-small text-muted">
        <span className="font-semibold text-ink">No. {post.number}</span>
        <br className="hidden md:block" />
        <span className="md:hidden">, </span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <br className="hidden md:block" />
        <span className="md:hidden">, </span>
        {post.readingMinutes} min read
      </p>
      <div>
        <h2 className="text-h3 md:text-h2">
          <Link
            href={`/writing/${post.slug}`}
            className="rounded-[4px] transition-colors duration-(--dur-hover) group-is-hover:text-signal after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-[58ch] font-serif text-lead text-slate md:text-essay-dek">
          {post.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </div>
    </article>
  );
}
