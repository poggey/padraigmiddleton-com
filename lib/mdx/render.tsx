import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { rehypeKeepRanges } from "./rehypeKeepRanges";

/**
 * Compiles an MDX body on the server at build time and returns it as React elements.
 * GitHub-flavoured Markdown gives footnotes; components such as <Chart> come from `components`.
 * A component used in the MDX but missing from `components` makes this throw.
 */
export async function renderMdx(body: string, components: MDXComponents) {
  const { default: Content } = await evaluate(body, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeKeepRanges],
  });
  return <Content components={components} />;
}
