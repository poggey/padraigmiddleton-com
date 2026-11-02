import { getProject, getProjects } from "@/lib/content";
import { og, ogImage } from "@/lib/og";
import { siteUrl } from "@/lib/site";

// The LinkedIn preview for a project: its kind, title, one line and key result.
export const size = og.size;
export const contentType = "image/png";
export const alt = "Project by Padraig Middleton";

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) return new Response("Not found", { status: 404 });
  return ogImage({
    label: project.kind,
    title: project.title,
    line: project.oneLine,
    figure: project.keyResult,
    domain: new URL(siteUrl).host,
  });
}
