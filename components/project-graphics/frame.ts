// Shared sizes for project graphics. Cards draw in a 400-wide box, wide cards (graphic on the
// side) in 600, case study pages in 800, so text stays a sensible size at every width.
export type Variant = "card" | "wide" | "page";

const sizes = {
  card: { w: 400, pad: 16, text: 12 },
  wide: { w: 600, pad: 20, text: 13 },
  page: { w: 800, pad: 32, text: 14 },
};

export function box(variant: Variant, ratio = 0.6) {
  const { w, pad, text } = sizes[variant];
  // Case study pages are wide, so their graphics are a little shallower.
  return { w, h: Math.round(w * ratio * (variant === "page" ? 0.82 : 1)), pad, text };
}

/** A scale from a domain to a range, like d3.scaleLinear. */
export function linear(d0: number, d1: number, r0: number, r1: number) {
  return (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

export const pathOf = (points: Array<[number, number]>) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
