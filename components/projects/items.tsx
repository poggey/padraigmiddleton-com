import { ProjectGraphic } from "@/components/ProjectGraphic";
import type { Project } from "@/lib/content";
import { statusText } from "@/lib/projectStatus";

const list = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });

export type ProjectItem = {
  slug: string;
  href: string;
  title: string;
  kind: string;
  year: number;
  oneLine: string;
  status: string;
  stack: string;
  keyResult?: { figure: string; label: string };
  todo?: string;
  /** The graphic at card size and at the larger preview size, rendered on the server. */
  graphic: React.ReactNode;
  largeGraphic: React.ReactNode;
};

// What the project layouts need from each project, with its graphics already drawn.
export function projectItems(projects: Project[]): ProjectItem[] {
  return projects.map((project) => ({
    slug: project.slug,
    href: `/projects/${project.slug}`,
    title: project.title,
    kind: project.kind,
    year: project.year,
    oneLine: project.oneLine,
    status: statusText(project),
    stack: list.format(project.stack),
    keyResult: project.keyResult,
    todo: project.todo?.replace(/^TODO\(Padraig\):\s*/, ""),
    graphic: <ProjectGraphic graphic={project.graphic} />,
    largeGraphic: <ProjectGraphic graphic={project.graphic} variant="wide" />,
  }));
}
