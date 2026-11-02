import type { Element, ElementContent, Root, RootContent } from "hast";
import { SKIP, visit } from "unist-util-visit";

// An MDX component in the tree, such as <Sidenote n="1">. MDX compiles these like any other JSX.
type JsxNode = {
  type: "mdxJsxTextElement" | "mdxJsxFlowElement";
  name: string;
  attributes: { type: "mdxJsxAttribute"; name: string; value: string }[];
  children: ElementContent[];
};

const isElement = (node: unknown, tag?: string): node is Element =>
  (node as Element)?.type === "element" && (!tag || (node as Element).tagName === tag);

/**
 * Turns Markdown footnotes into sidenotes. GitHub-flavoured Markdown renders `[^id]` as a
 * superscript link and collects the sources in a list at the end. This puts each source back
 * where it is cited, as <Sidenote n="1" id="…">the source</Sidenote>, and turns the list at the
 * end into <Sources>, without the "back to reference" arrows.
 */
export function rehypeSidenotes() {
  return (tree: Root) => {
    const index = tree.children.findIndex(
      (node) => isElement(node, "section") && node.properties.dataFootnotes,
    );
    if (index === -1) return;
    const section = tree.children[index] as Element;
    const list = section.children.find((node) => isElement(node, "ol")) as Element;

    // Each source's text, keyed by the list item's id, with the back links removed.
    const sources = new Map<string, ElementContent[]>();
    for (const item of list.children) {
      if (!isElement(item, "li")) continue;
      visit(item, "element", (node, i, parent) => {
        if (node.properties.dataFootnoteBackref === undefined || !parent || i === undefined) return;
        parent.children.splice(i, 1);
        return [SKIP, i];
      });
      const paragraph = item.children.find((node) => isElement(node, "p")) as Element;
      // Drop the spaces that sat before the back links.
      let last = paragraph.children.at(-1);
      while (last?.type === "text") {
        last.value = last.value.trimEnd();
        if (last.value) break;
        paragraph.children.pop();
        last = paragraph.children.at(-1);
      }
      sources.set(String(item.properties.id), paragraph.children);
    }

    visit(tree, "element", (node, i, parent) => {
      const link = node.children[0];
      if (node.tagName !== "sup" || !isElement(link, "a") || !link.properties.dataFootnoteRef)
        return;
      if (!parent || i === undefined) return;
      const sidenote: JsxNode = {
        type: "mdxJsxTextElement",
        name: "Sidenote",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "n",
            value: String((link.children[0] as { value: string }).value),
          },
          {
            type: "mdxJsxAttribute",
            name: "id",
            value: String(link.properties.id).replace("user-content-fnref-", ""),
          },
        ],
        children: structuredClone(sources.get(String(link.properties.href).slice(1)) ?? []),
      };
      parent.children[i] = sidenote as unknown as ElementContent;
      return SKIP;
    });

    const sourcesNode: JsxNode = {
      type: "mdxJsxFlowElement",
      name: "Sources",
      attributes: [],
      children: [list],
    };
    tree.children[index] = sourcesNode as unknown as RootContent;
  };
}
