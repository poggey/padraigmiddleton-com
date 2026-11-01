import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Stub } from "@/components/Stub";
import { getProject, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

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
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return (
    <Container className="pt-32 pb-(--section-y)">
      <p className="text-small text-muted">{project.kind}</p>
      <h1 className="mt-3 text-title">{project.title}</h1>
      <p className="mt-6 max-w-[48ch] text-lead text-slate">{project.oneLine}</p>
      <Stub phase={7} />
    </Container>
  );
}
