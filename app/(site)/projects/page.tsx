import { Container } from "@/components/Container";
import { AlsoBuilt } from "@/components/projects/AlsoBuilt";
import { ProjectList } from "@/components/projects/ProjectList";
import { getProjects, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const { projects: copy } = getSite().sections;
export const metadata = pageMetadata({
  title: copy.heading,
  description: copy.intro,
  path: "/projects",
});

// Every project on night: the main work as an index with emblems, the rest listed beneath.
export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <section
      data-tone="night"
      data-nav-tone="night"
      className="night-band min-h-svh pt-32 pb-(--section-y)"
    >
      <Container>
        <h1 className="text-title text-night-text">{copy.heading}</h1>
        <p className="mt-4 max-w-[60ch] text-lead text-night-muted">{copy.intro}</p>
        <div className="mt-12">
          <ProjectList projects={projects.filter((p) => p.featured)} heading={2} />
        </div>
        <AlsoBuilt projects={projects.filter((p) => !p.featured)} heading={2} />
      </Container>
    </section>
  );
}
