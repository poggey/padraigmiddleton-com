import Link from "next/link";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { getPosts, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const site = getSite();
export const metadata = pageMetadata({ description: site.description, path: "/" });

// The homepage. The hero is in place; the sections below it are built in Phases 6 and 7.
export default function HomePage() {
  const latest = getPosts()[0];
  return (
    <>
      <Hero
        headline={site.hero.headline}
        subline={site.hero.subline}
        primary={site.hero.primaryButton}
        secondary={site.hero.secondaryButton}
        latestEssay={`/writing/${latest.slug}`}
      />
      <Container className="py-(--section-y)">
        <h2 className="text-h2">{site.sections.writing.heading}</h2>
        <p className="mt-3 max-w-[60ch] text-lead text-slate">{site.sections.writing.intro}</p>
        <p className="mt-8">
          <Link
            href={`/writing/${latest.slug}`}
            className="text-h3 underline decoration-line-strong underline-offset-8"
          >
            {latest.title}
          </Link>
        </p>
        <p className="mt-16 text-small text-muted">
          The homepage sections below the hero are built in Phases 6 and 7.
        </p>
      </Container>
    </>
  );
}
