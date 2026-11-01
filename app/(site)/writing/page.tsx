import Link from "next/link";
import { Container } from "@/components/Container";
import { Stub } from "@/components/Stub";
import { getPosts, getSite } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

const { writing } = getSite().sections;
export const metadata = pageMetadata({
  title: writing.heading,
  description: writing.intro,
  path: "/writing",
});

export default function WritingPage() {
  return (
    <Container className="pt-32 pb-(--section-y)">
      <h1 className="text-title">{writing.heading}</h1>
      <p className="mt-4 max-w-[60ch] text-lead text-slate">{writing.intro}</p>
      <ul className="mt-12 space-y-6">
        {getPosts().map((post) => (
          <li key={post.slug}>
            <p className="text-small text-muted">
              No. {post.number}, {formatDate(post.date)}, {post.readingMinutes} min read
            </p>
            <Link
              href={`/writing/${post.slug}`}
              className="text-h3 underline decoration-line-strong underline-offset-8"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <Stub phase={9} />
    </Container>
  );
}
