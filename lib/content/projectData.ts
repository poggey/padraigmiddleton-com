import { readFileSync } from "node:fs";
import path from "node:path";

/** The source line of a project's graphic data (public/data/projects/<slug>.json). */
export function graphicSource(slug: string) {
  const file = path.join(process.cwd(), "public/data/projects", `${slug}.json`);
  return (JSON.parse(readFileSync(file, "utf8")) as { source: string }).source;
}
