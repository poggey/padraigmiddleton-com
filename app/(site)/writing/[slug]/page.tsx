import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/essay/AuthorCard";
import { EssayHeader } from "@/components/essay/EssayHeader";
import { EssayNav } from "@/components/essay/EssayNav";
import { getPost, getPosts, getSite } from "@/lib/content";
import { essayComponents } from "@/lib/mdx/essayComponents";
import { renderMdx } from "@/lib/mdx/render";
import { pageMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";

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
    ownImage: true,
  });
}

export default async function EssayPage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const posts = getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const post = posts[index];
  const site = getSite();

  return (
    // A size container, so figures can be sized against the page rather than the text column.
    <article className="@container pt-28 pb-(--section-y) md:pt-36">
      <div className="mx-auto w-full max-w-[calc(var(--measure-essay)+2*var(--gutter))] px-(--gutter)">
        <EssayHeader post={post} url={`${siteUrl}/writing/${post.slug}`} />
        <div data-essay-body className="mt-14 md:mt-20">
          {await renderMdx(post.body, essayComponents)}
        </div>
        <AuthorCard line={site.hero.subline} cv={site.contact.cv} />
        <EssayNav newer={posts[index - 1]} older={posts[index + 1]} />
      </div>
    </article>
  );
}
