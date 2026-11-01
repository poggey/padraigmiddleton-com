export type Footnote = { id: string; number: number; text: string };

/**
 * Markdown footnotes as sidenote data: `[^id]` in the text, `[^id]: source` on its own line.
 * Numbered in the order they are first referenced. Each definition must fit on one line, and
 * every reference must have a definition (and the other way round), or this throws.
 */
export function extractFootnotes(body: string, file: string): Footnote[] {
  const definitions = new Map<string, string>();
  for (const [, id, text] of body.matchAll(/^\[\^([^\]]+)\]:[ \t]*(.+)$/gm)) {
    definitions.set(id, text.trim());
  }
  const prose = body.replace(/^\[\^[^\]]+\]:.*$/gm, "");
  const order: string[] = [];
  for (const [, id] of prose.matchAll(/\[\^([^\]]+)\]/g)) {
    if (!order.includes(id)) order.push(id);
  }

  const missing = order.filter((id) => !definitions.has(id));
  const unused = [...definitions.keys()].filter((id) => !order.includes(id));
  if (missing.length || unused.length) {
    throw new Error(
      `Footnote problem in ${file}: ` +
        [
          missing.length && `no source for [^${missing.join("], [^")}]`,
          unused.length && `source never referenced: [^${unused.join("], [^")}]`,
        ]
          .filter(Boolean)
          .join("; "),
    );
  }
  return order.map((id, i) => ({ id, number: i + 1, text: definitions.get(id)! }));
}
