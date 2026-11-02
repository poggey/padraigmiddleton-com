import Link from "next/link";
import { Container } from "@/components/Container";
import { EssayList } from "@/components/EssayList";
import { EssayRow } from "@/components/EssayRow";
import { getPosts, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const { writing } = getSite().sections;
export const metadata = pageMetadata({
  title: writing.heading,
  description: writing.intro,
  path: "/writing",
});

// Every essay, newest first, then what's coming and how to follow along.
export default function WritingPage() {
  const items = getPosts().map((post) => ({
    slug: post.slug,
    tags: post.tags,
    row: <EssayRow post={post} />,
  }));
  return (
    <Container className="pt-32 pb-(--section-y)">
      <h1 className="text-title">{writing.heading}</h1>
      <p className="mt-4 max-w-[60ch] text-lead text-slate">{writing.intro}</p>
      <EssayList items={items} />
      <p className="mt-10 text-slate">
        {writing.emptySlot}{" "}
        <Link
          href="/rss.xml"
          className="rounded-[2px] font-semibold text-signal underline decoration-signal/35 underline-offset-4 is-hover:decoration-signal"
        >
          Follow by RSS
        </Link>
      </p>
    </Container>
  );
}
