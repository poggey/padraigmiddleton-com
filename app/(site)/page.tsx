import { Button } from "@/components/Button";
import { Hero } from "@/components/Hero";
import { ContactPanel } from "@/components/home/ContactPanel";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { WritingSection } from "@/components/home/WritingSection";
import { ProjectsBento } from "@/components/ProjectsBento";
import { Section } from "@/components/Section";
import { getExperience, getPosts, getProjects, getSite } from "@/lib/content";
import { essayParagraphs } from "@/lib/essayText";
import { pageMetadata } from "@/lib/metadata";

const site = getSite();
export const metadata = pageMetadata({ description: site.description, path: "/" });

export default function HomePage() {
  const posts = getPosts();
  const latest = posts[0];

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

      <Section
        id="projects"
        title={site.sections.projects.heading}
        intro={site.sections.projects.intro}
        tone="night"
      >
        <ProjectsBento projects={getProjects().filter((p) => p.homepage)} />
        <Button tone="night" variant="secondary" href="/projects" className="mt-10">
          {site.sections.projects.button}
        </Button>
      </Section>

      <ExperienceSection experience={getExperience()} copy={site.sections.experience} />

      <ContactPanel
        copy={site.sections.contact}
        contact={site.contact}
        essay={essayParagraphs(`${latest.slug}.mdx`)}
      />
    </>
  );
}
