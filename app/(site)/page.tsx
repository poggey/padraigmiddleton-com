import { Hero } from "@/components/Hero";
import { ContactPanel } from "@/components/home/ContactPanel";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { WritingSection } from "@/components/home/WritingSection";
import { AlsoBuilt } from "@/components/projects/AlsoBuilt";
import { ProjectList } from "@/components/projects/ProjectList";
import { Section } from "@/components/Section";
import { getExperience, getPosts, getProjects, getSite } from "@/lib/content";
import { essayParagraphs } from "@/lib/essayText";
import { pageMetadata } from "@/lib/metadata";

const site = getSite();
export const metadata = pageMetadata({ description: site.description, path: "/" });

export default function HomePage() {
  const posts = getPosts();
  const latest = posts[0];
  const projects = getProjects();

  return (
    <>
      <Hero
        headline={site.hero.headline}
        subline={site.hero.subline}
        primary={site.hero.primaryButton}
        secondary={site.hero.secondaryButton}
        latestEssay={`/writing/${latest.slug}`}
      />

      <ExperienceSection experience={getExperience()} copy={site.sections.experience} />

      <WritingSection posts={posts} copy={site.sections.writing} />

      <Section
        id="projects"
        title={site.sections.projects.heading}
        intro={site.sections.projects.intro}
        tone="night"
      >
        <div className="mt-12">
          <ProjectList projects={projects.filter((p) => p.featured)} />
        </div>
        <AlsoBuilt projects={projects.filter((p) => !p.featured)} />
      </Section>

      <ContactPanel
        copy={site.sections.contact}
        contact={site.contact}
        essay={essayParagraphs(`${latest.slug}.mdx`)}
      />
    </>
  );
}
