const WORDS_PER_MINUTE = 230;

// Minutes to read an MDX essay: body text only, without frontmatter, components or footnote sources.
export function readingMinutes(mdx: string) {
  const body = mdx
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^\[\^[^\]]+\]:.*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[\^[^\]]+\]/g, "");
  const words = body.split(/\s+/).filter((word) => /\w/.test(word)).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
