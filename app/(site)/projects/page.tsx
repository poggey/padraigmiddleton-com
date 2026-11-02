import { Container } from "@/components/Container";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { ProjectTile } from "@/components/ProjectTile";
import { getProjects, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const { projects: copy } = getSite().sections;
export const metadata = pageMetadata({
  title: copy.heading,
  description: copy.intro,
  path: "/projects",
});

// Every project on night, filterable by group.
export default function ProjectsPage() {
  const items = getProjects().map((project) => ({
    slug: project.slug,
    group: project.group,
    size: project.size,
    tile: (
      <ProjectTile
        project={project}
        layout={project.size === "feature" ? "side" : "top"}
        heading={2}
      />
    ),
  }));
  return (
    <section
      data-tone="night"
      data-nav-tone="night"
      className="night-band min-h-svh pt-32 pb-(--section-y)"
    >
      <Container>
        <h1 className="text-title text-night-text">{copy.heading}</h1>
        <p className="mt-4 max-w-[60ch] text-lead text-night-muted">{copy.intro}</p>
        <ProjectsGrid items={items} />
      </Container>
    </section>
  );
}
