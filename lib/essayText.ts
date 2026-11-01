import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * The paragraphs of an essay as plain text, exactly as written: no frontmatter, components,
 * footnote markers or footnote sources. Read at build time. The folder is fixed so the build
 * only traces the essays, not the whole project.
 */
export function essayParagraphs(file: string) {
  const source = readFileSync(path.join(process.cwd(), "content/posts", file), "utf8");
  return source
    .replace(/^---[\s\S]*?---/, "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block && !block.startsWith("<") && !block.startsWith("[^"))
    .map((block) => block.replace(/\[\^[^\]]+\]/g, ""));
}
