import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parseContent, projectSchema, type ProjectFrontmatter } from "./schemas";

export type Project = ProjectFrontmatter & { body: string };

function readProject(file: string): Project {
  const raw = readFileSync(path.join(process.cwd(), "content/projects", file), "utf8");
  const { data, content } = matter(raw);
  const where = `content/projects/${file}`;
  const project = parseContent(projectSchema, data, where);
  if (`${project.slug}.mdx` !== file) {
    throw new Error(`Invalid content in ${where}: slug "${project.slug}" does not match the file name`);
  }
  return { ...project, body: content };
}

/** Every project, in display order. */
export function getProjects() {
  const files = readdirSync(path.join(process.cwd(), "content/projects")).filter((f) => f.endsWith(".mdx"));
  const projects = files.map(readProject).sort((a, b) => a.order - b.order);

  const orders = projects.map((p) => p.order);
  const repeated = orders.find((n, i) => orders.indexOf(n) !== i);
  if (repeated !== undefined) throw new Error(`Two projects share order ${repeated} in content/projects`);
  return projects;
}

export function getProject(slug: string) {
  return getProjects().find((p) => p.slug === slug);
}
