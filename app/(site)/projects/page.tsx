import Link from "next/link";
import { Container } from "@/components/Container";
import { Stub } from "@/components/Stub";
import { getProjects, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const { projects } = getSite().sections;
export const metadata = pageMetadata({
  title: projects.heading,
  description: projects.intro,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <Container className="pt-32 pb-(--section-y)">
      <h1 className="text-title">{projects.heading}</h1>
      <p className="mt-4 max-w-[60ch] text-lead text-slate">{projects.intro}</p>
      <ul className="mt-12 space-y-6">
        {getProjects().map((project) => (
          <li key={project.slug}>
            <p className="text-small text-muted">{project.kind}</p>
            <Link
              href={`/projects/${project.slug}`}
              className="text-h3 underline decoration-line-strong underline-offset-8"
            >
              {project.title}
            </Link>
            <p className="mt-1 max-w-[60ch] text-slate">{project.oneLine}</p>
          </li>
        ))}
      </ul>
      <Stub phase={9} />
    </Container>
  );
}
