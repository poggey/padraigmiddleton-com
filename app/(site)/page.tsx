import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { ContactPanel } from "@/components/home/ContactPanel";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { LedgerPreview } from "@/components/home/LedgerPreview";
import { WritingSection } from "@/components/home/WritingSection";
import { Section } from "@/components/Section";
import { getExperience, getPosts, getPredictions, getSite } from "@/lib/content";
import { essayParagraphs } from "@/lib/essayText";
import { recordSentence } from "@/lib/ledger";
import { pageMetadata } from "@/lib/metadata";

const site = getSite();
export const metadata = pageMetadata({ description: site.description, path: "/" });

export default function HomePage() {
  const posts = getPosts();
  const latest = posts[0];
  const predictions = getPredictions();
  const entries = predictions.map((p) => {
    const essay = posts.find((post) => post.slug === p.essaySlug);
    return { ...p, essayTitle: essay?.title ?? "", essayNumber: essay?.number ?? 0 };
  });

  return (
    <>
      <Hero
        headline={site.hero.headline}
        subline={site.hero.subline}
        primary={site.hero.primaryButton}
        secondary={site.hero.secondaryButton}
        latestEssay={`/writing/${latest.slug}`}
      />

      <WritingSection posts={posts} copy={site.sections.writing} />

      {/* Built in Phase 7: the projects bento with each project's own graphic. */}
      <Section
        id="projects"
        title={site.sections.projects.heading}
        intro={site.sections.projects.intro}
        tone="night"
      >
        <p className="mt-12 text-small text-night-muted">The projects band is built in Phase 7.</p>
      </Section>

      <section id="ledger" aria-labelledby="ledger-heading" className="py-(--section-y)">
        <Container>
          <LedgerPreview
            entries={entries}
            record={recordSentence(predictions)}
            copy={site.sections.ledger}
          />
        </Container>
      </section>

      <ExperienceSection experience={getExperience()} copy={site.sections.experience} />

      <ContactPanel
        copy={site.sections.contact}
        contact={site.contact}
        essay={essayParagraphs(`${latest.slug}.mdx`)}
      />
    </>
  );
}
