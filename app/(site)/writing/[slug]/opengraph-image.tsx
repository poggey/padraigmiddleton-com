import { getPost, getPosts } from "@/lib/content";
import { og, ogImage } from "@/lib/og";
import { siteUrl } from "@/lib/site";

// The LinkedIn preview for an essay: its number, title and first key figure.
export const size = og.size;
export const contentType = "image/png";
export const alt = "Essay by Padraig Middleton";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  return ogImage({
    label: `No. ${post.number}`,
    title: post.title,
    figure: post.keyFigures?.[0],
    domain: new URL(siteUrl).host,
  });
}
