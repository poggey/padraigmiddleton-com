/**
 * The page's guide lines: two hairlines at the outer edges of the content column, running the
 * full height of the page, over every section and the hero ribbon alike. Sections add a hairline
 * across the page where they meet, so the layout reads as one drawn grid. Wide screens only.
 */
export function PageFrame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-full max-w-[calc(var(--container)+2*var(--gutter))] -translate-x-1/2 border-x border-frame lg:block"
    />
  );
}
