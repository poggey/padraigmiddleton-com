# Notes

Design decisions, rejected ideas and quirks, so later sessions do not repeat them.

## Phase 0 decisions (1 November 2026)

- **Kit location.** `build-kit/` unzipped from `files/build-kit.zip` into the project root; `CLAUDE.md` copied to the root.
- **Essay source.** `Posts/budget-2026-linkers.md` is the canonical text of "The bill Britain keeps signing". Its body has been copied into `build-kit/content/posts/the-bill-britain-keeps-signing.mdx` with typography fixes only (curly quotes and apostrophes, en dashes in year ranges; URLs untouched). The kit's frontmatter is kept.
  - No `<PullQuote>`: "Not tax adjustments…" stays a plain paragraph.
  - "Where could I be wrong?" stays a plain paragraph in Padraig's words. Any card styling must not add a heading that repeats it.
  - The essay chart is the debt interest as a share of GDP line chart from `Posts/debt-interest.svg` (`<Chart id="debt-interest-gdp" />`), redrawn in the site's chart style from the same data. The £bn bar figures in `04-content.md` remain for the hero key-figure card.
  - `<HeadroomSlider />` and `<Prediction id="001" />` are kept: they add no words to the essay.
- **Dates are flexible.** The essay and prediction 001 are dated 3 November 2026 for now. The priority is a finished site as soon as possible. At launch, set the essay `date` and prediction `made` to the day the essay first goes public.
- **How prediction 001 is judged** (decided by Claude at Padraig's request; publish this on the Ledger):
  - Judged against the 2027–28 gilt remit as first published by the DMO, normally alongside the Spring Statement.
  - Measure: index-linked gilt sales as a share of total planned gilt sales, calculated the same way as the 9.3% quoted for 2026–27.
  - 9.3% or above counts as wrong.
  - If the remit has not been published by the check date, the check waits until it is.
- **Defaults adopted** (proposed in Phase 0, no objection from Padraig):
  - Headline option B, since A and C are over the 14-word limit. Final pick in Phase 5.
  - Night surfaces on the homepage: the projects band, plus one merged contact and footer block at the end.
  - The open-prediction dot does not pulse.
  - Nav items link to routes; the current route is underlined.
  - Homepage shows five projects; `/projects` shows all seven.
  - Escape Velocity gets a title card, no chart.
  - Light mode only (`color-scheme: light`). The logo is the name set in Schibsted Grotesk.
  - No GSAP and no Lenis. Nothing in the spec needs scroll-linked timing, both cost JavaScript budget, and Lenis breaks anchor jumps to footnotes.
  - Drop cap: try it, cut it if "I’ve" looks awkward.
  - Glass exceptions: the mobile menu sheet counts as part of the nav; the gold-curve tooltip is allowed as a fifth use.

## Phase 1: setup (1 November 2026)

- **Versions.** Next.js 16.4.3, React 19.3.0, Tailwind 4.3.3, TypeScript 5.9.3, Playwright 1.64.1, Prettier 3.9.10. All pinned exactly.
- **Next.js 16 defaults kept:** `cacheComponents` and `partialPrefetching` are on (create-next-app default). The bundled docs in `node_modules/next/dist/docs/` are the reference for this version; read them before using an API from memory.
- **Tailwind runs through `@tailwindcss/turbopack`** (the create-next-app default for this version), not PostCSS.
- **Fonts.** Schibsted Grotesk supports tabular figures (`tnum`), but its default digits are proportional ("111" is 41px wide at 40px, "000" is 75px). Use `tabular-nums` wherever numbers line up. Source Serif 4 is loaded with its optical size axis and italics (for pull quotes).
- **Type scale is fluid.** Sizes interpolate from the mobile value at 390px to the desktop value at 1440px with `clamp()`. Line heights switch from mobile to desktop values at 768px. Verified by measurement at 390 and 1440: exact match to the spec.
- **Spec gap filled:** `essay-dek` and `pull` have no mobile size in the kit. Chosen: dek 21px and pull 26px at 390px, rising to the spec's 24px and 32px. 32px italic was too large for a 350px column.
- **Token naming.** Radii and easing are defined in a `@theme static` block because their names match Tailwind's own namespaces; defining them in `:root` as well would create self-referencing variables. Everything else lives in `:root` and is mapped into `@theme inline`.
- **Spring settings** (stiffness 380, damping 36) are JavaScript values for Motion, so they will live in `lib/motion.ts` rather than `globals.css`. The one exception to "tokens in one place".
- **Reduced motion** sets every `--dur-*` token to 0ms, both for the media query and for `data-motion="reduce"` on `<html>` (for the `/lab` toggle in Phase 2).
- **Screenshots run on port 4310** and never reuse an existing server. Padraig's `personal-site` project has dev servers running on 3000 and 3100, and the first screenshot run captured its 404 page by mistake.
- **`npm audit`** reports 16 moderate issues, all in ESLint's dependencies (`minimatch`). Development only, nothing shipped. Not force-fixed.
- **Removed** the default Next.js favicon. A real favicon is still needed.
