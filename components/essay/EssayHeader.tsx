import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { CopyLinkButton } from "@/components/essay/CopyLinkButton";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";

// The essay's opening: number and tags, title, standfirst, byline and the two share actions.
export function EssayHeader({ post, url }: { post: Post; url: string }) {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-small font-semibold">No. {post.number}</span>
        {post.tags.map((tag) => (
          <Chip key={tag}>{tag}</Chip>
        ))}
      </div>
      <h1 className="mt-6 text-title">{post.title}</h1>
      <p className="mt-6 max-w-[42ch] font-serif text-essay-dek text-slate">{post.summary}</p>
      <p className="mt-8 text-small text-muted">
        Padraig Middleton, <time dateTime={post.date}>{formatDate(post.date)}</time>,{" "}
        {post.readingMinutes} min read
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <CopyLinkButton url={url} />
        <Button
          variant="secondary"
          size="sm"
          external
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        >
          Share on LinkedIn
        </Button>
      </div>
    </header>
  );
}
