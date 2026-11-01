import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { readingMinutes } from "@/lib/readingTime";
import { extractFootnotes, type Footnote } from "./footnotes";
import { parseContent, postSchema, type PostFrontmatter } from "./schemas";

export type Post = PostFrontmatter & {
  slug: string;
  /** The MDX body, without frontmatter. */
  body: string;
  readingMinutes: number;
  footnotes: Footnote[];
};

function readPost(file: string): Post {
  const raw = readFileSync(path.join(process.cwd(), "content/posts", file), "utf8");
  const { data, content } = matter(raw);
  const where = `content/posts/${file}`;
  return {
    ...parseContent(postSchema, data, where),
    slug: file.replace(/\.mdx$/, ""),
    body: content,
    readingMinutes: readingMinutes(raw),
    footnotes: extractFootnotes(content, where),
  };
}

/** Every essay, newest first. Drafts are left out in production unless asked for. */
export function getPosts({
  includeDrafts = process.env.NODE_ENV !== "production",
}: { includeDrafts?: boolean } = {}) {
  const files = readdirSync(path.join(process.cwd(), "content/posts")).filter((f) => f.endsWith(".mdx"));
  const posts = files.map(readPost).sort((a, b) => b.number - a.number);

  const numbers = posts.map((p) => p.number);
  const repeated = numbers.find((n, i) => numbers.indexOf(n) !== i);
  if (repeated) throw new Error(`Two essays share number ${repeated} in content/posts`);

  return includeDrafts ? posts : posts.filter((p) => !p.draft);
}

export function getPost(slug: string, options?: { includeDrafts?: boolean }) {
  return getPosts(options).find((p) => p.slug === slug);
}
