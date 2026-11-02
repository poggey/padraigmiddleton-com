import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { ProjectGraphic } from "@/components/ProjectGraphic";
import { Todo } from "@/components/Todo";
import { getProject, getProjects } from "@/lib/content";
import { graphicSource } from "@/lib/content/projectData";
import { pageMetadata } from "@/lib/metadata";
import { projectComponents } from "@/lib/mdx/projectComponents";
import { renderMdx } from "@/lib/mdx/render";
import { statusText } from "@/lib/projectStatus";

const list = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.oneLine,
    path: `/projects/${project.slug}`,
    ownImage: true,
  });
}

// A project case study: header, key result, the large graphic, the write-up, then the next project.
export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const projects = getProjects();
  const next = projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length];
  const body = await renderMdx(project.body, projectComponents);

  return (
    <article className="pt-32 pb-(--section-y)">
      <Container>
        <p className="text-small text-muted">
          <Link
            href="/projects"
            className="text-signal underline decoration-signal/35 underline-offset-4 is-hover:decoration-signal"
          >
            Projects
          </Link>
          , {project.kind}
        </p>
        <h1 className="mt-4 text-title">{project.title}</h1>
        <p className="mt-6 max-w-[48ch] text-lead text-slate">{project.oneLine}</p>
        <p className="mt-4 text-small text-muted">
          <span className="font-semibold text-ink">{statusText(project)}.</span> {project.year}.
          Built with {list.format(project.stack)}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.links.live && (
            <Button href={project.links.live} external>
              View the live project
            </Button>
          )}
          <Button variant="secondary" href={project.links.repo} external>
            View on GitHub
          </Button>
        </div>
        {project.todo && <Todo>{project.todo.replace(/^TODO\(Padraig\):\s*/, "")}</Todo>}
      </Container>

      <Container className="mt-16">
        <figure
          data-tone="night"
          className="rounded-feature bg-night-raised p-5 shadow-[inset_0_0_0_1px_var(--night-line)] md:p-10"
        >
          <ProjectGraphic graphic={project.graphic} variant="page" />
          <figcaption className="mt-6 text-small text-night-muted">
            Source: {graphicSource(project.slug)}.
          </figcaption>
        </figure>
      </Container>

      {/* On wide screens the key result sits beside the write-up and stays in view. */}
      <Container className="mt-16 lg:grid lg:grid-cols-[minmax(0,var(--measure-essay))_minmax(0,1fr)] lg:gap-16">
        {project.keyResult && (
          <aside className="mb-12 lg:order-2 lg:mb-0">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-l-2 border-gilt pl-5 lg:sticky lg:top-28 lg:flex-col">
              <span className="text-stat">{project.keyResult.figure}</span>
              <span className="max-w-[36ch] text-slate">{project.keyResult.label}</span>
            </p>
          </aside>
        )}
        <div className="lg:order-1">{body}</div>
      </Container>

      <Container className="mt-(--section-y)">
        <Link
          href={`/projects/${next.slug}`}
          className="group block rounded-card bg-paper p-6 shadow-e1 transition-[translate,box-shadow] duration-(--dur-hover) ease-out is-hover:-translate-y-0.5 is-hover:shadow-e2 md:p-8"
        >
          <span className="text-small text-muted">Next project</span>
          <span className="mt-2 block text-h3">{next.title}</span>
          <span className="mt-1 block max-w-[60ch] text-slate">{next.oneLine}</span>
        </Link>
      </Container>
    </article>
  );
}
