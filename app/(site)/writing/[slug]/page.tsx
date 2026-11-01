import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Stub } from "@/components/Stub";
import { getPost, getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.summary,
    path: `/writing/${post.slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function EssayPage({ params }: PageProps<"/writing/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return (
    <Container className="pt-32 pb-(--section-y)">
      <p className="text-small text-muted">
        No. {post.number}, {formatDate(post.date)}, {post.readingMinutes} min read
      </p>
      <h1 className="mt-3 max-w-[18ch] text-title">{post.title}</h1>
      <p className="mt-6 max-w-[40ch] font-serif text-essay-dek text-slate">{post.summary}</p>
      <Stub phase={8} />
    </Container>
  );
}
