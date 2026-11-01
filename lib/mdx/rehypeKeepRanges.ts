import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { keepRangesTogether } from "@/lib/typography";

// Keeps number ranges such as 2027–28 on one line, in every piece of text in MDX content.
export function rehypeKeepRanges() {
  return (tree: Root) => {
    visit(tree, "text", (node) => {
      node.value = keepRangesTogether(node.value);
    });
  };
}
