import Link from "next/link";
import { Section } from "@/components/Section";
import type { Post } from "@/lib/content";
import { essayParagraphs } from "@/lib/essayText";
import { formatDate } from "@/lib/format";
import { EssayFirstPage } from "./EssayFirstPage";

const link =
  "inline-flex min-h-11 items-center rounded-[4px] text-small font-semibold text-signal underline decoration-signal/35 underline-offset-4 is-hover:decoration-signal";

/**
 * The newest essay as its own first page, so it is plainly an article to open, then any older
 * essays as a ruled list.
 */
export function WritingSection({
  posts,
  copy,
}: {
  posts: Post[];
  copy: { heading: string; intro: string; emptySlot: string };
}) {
  const [latest, ...older] = posts;

  return (
    <Section id="writing" title={copy.heading} intro={copy.intro}>
      <div className="mt-12">
        <EssayFirstPage post={latest} opening={essayParagraphs(`${latest.slug}.mdx`)[0]} />
      </div>

      {older.length > 0 && (
        <ul className="mt-10 border-t border-line">
          {older.slice(0, 3).map((post) => (
            <li key={post.slug} className="border-b border-line">
              <Link
                href={`/writing/${post.slug}`}
                className="group grid gap-1 rounded-[2px] py-6 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:gap-8"
              >
                <span className="text-small text-muted">
                  No. {post.number}, {formatDate(post.date)}
                </span>
                <span>
                  <span className="block text-lead font-semibold transition-colors duration-(--dur-hover) group-is-hover:text-signal">
                    {post.title}
                  </span>
                  <span className="mt-1 block max-w-[64ch] text-slate">{post.summary}</span>
                </span>
                <span className="text-small text-muted md:text-right">
                  {post.readingMinutes} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 flex flex-wrap items-center gap-x-6">
        {older.length === 0 && <span className="text-slate">{copy.emptySlot}</span>}
        <Link href="/writing" className={link}>
          All essays
        </Link>
        <Link href="/rss.xml" className={link}>
          Follow by RSS
        </Link>
      </p>
    </Section>
  );
}
