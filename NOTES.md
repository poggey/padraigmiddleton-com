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

## Phase 2: design lab (1 November 2026)

- **Tabular figures quirk.** Schibsted Grotesk's `tnum` also widens `. , : ; # %` to full digit width, so "0.76" and "4.2%" look gappy. Use `tabular-nums` only where digits must line up in columns (tables, Ledger day counts, axis ticks). Standalone figures (stats, key results, chart labels) stay proportional. This departs from the spec's "tabular figures in stats".
- **Dates are worked out in the browser.** With Cache Components on, `new Date()` fails a static prerender. Anything that counts days (`ProgressBar`, later the Ledger) uses `lib/useToday.ts`, so it is always correct without a daily rebuild. The line is blank for a moment before the page loads, and its height is reserved.
- **Turbopack CSS rule.** The create-next-app rule sent every `*.css` file through Tailwind as global CSS, which silently broke CSS modules: the class was never applied. `next.config.ts` now excludes `*.module.css`. Found because a behaviour test passed for the wrong reason: a missing pseudo-element reports opacity 1. The test now checks `content` too.
- **Two kinds of glass.** `glass` for floating surfaces (border and e3 shadow, as specified) and `glass-bar` for the nav (same blur, bottom hairline, no shadow). A full-width bar with e3 looked heavy.
- **State variants.** `is-hover` (hover devices only), `is-active` and `group-is-hover` also respond to `data-force`, which only `/lab` sets, so states can be shown side by side. The `reduced` variant matches the media query and `data-motion="reduce"` (the lab switch).
- **Night surfaces** set `data-tone="night"`, which switches the focus ring to `--signal-soft`. `--signal` on night-raised is 2.9:1, under the 3:1 needed for focus indicators.
- **Essay card.** The glass key-figure chip first sat at the top right of the chart and hid the gold 2031–32 point and its label. It now spans the panel's top edge above the plot area, as a horizontal chip.
- **Project card footer.** Status was a bordered chip beside a plain stack line. Cut to one sentence ("Live. Built with Python, Streamlit and Plotly.") as the "remove one accessory" fix. Slash and middle-dot separators were rejected as template chrome.
- **Mobile nav** shows the name, "Download CV" and an icon-only menu button (labelled "Menu" for screen readers), so the CV stays one tap away on phones.
- **Charts.** `LineChart` draws the line in SVG and puts dots and labels in HTML so text stays sharp at any width. It reveals with a clip-path wipe over `--dur-reveal` when 40% visible. The forecast is dashed. The essay chart data is in `content/charts/debt-interest-gdp.json`, recovered from `Posts/debt-interest.svg`.
- **Ranges.** `lib/typography.ts` keeps "2027–28" from breaking at the en dash. Phase 3 should apply it to all content automatically.
- **Gold on light** is 2.4:1, below 3:1 for graphics. Every gold mark on light is paired with text: the progress bar says "x days to go", chart dots have value labels, status chips have words.
- **Reading time** for essay No. 1 computes to 3 minutes (about 730 words at 230 per minute).
- **Placeholders.** The lab's project graphics are labelled placeholder boxes until Phase 7. The side-layout feature card has a tall empty text column because of the placeholder; real graphics will set its height.

## Feedback after Phase 2 (1 November 2026)

- **Radii tightened** to 4 / 8 / 12 / 16px (was 12 / 20 / 28 / 36). Padraig: heavy rounding looked amateur. Buttons, chips and tabs stay pills. Graphics inside cards use 4px so nested corners line up.
- **No rows of stats anywhere.** Padraig sees them as an AI trademark. Removed from the spec: the proof strip, the row of three key figures under each essay header, and the "650+" hero card. The Ledger record is written as a sentence. Kit docs amended (02, 03, 04, 06) and the AI-tells list extended (10 to 12).
- **The night band glow stays.** Padraig liked the dark blue to lighter blue light on the projects band.
- **Hero graphic.** Padraig wants something with the impact of Stripe's flowing colour graphic, not a copy. Direction agreed before building: see the Phase 5 notes once decided.

## Hero ribbon prototype (1 November 2026)

Padraig chose a light hero and asked for the ribbon to be prototyped before content work, so part of Phase 5 (data, then the field) came forward. It lives on `/lab` as the first section.

- **Data source.** Stirling uses the Bank of England database (IADB) for 5, 10 and 20-year par yields only (no 2-year series exists there). The ribbon instead uses the Bank's full nominal spot curve ("4. spot curve" sheet), every half-year from 6 months to 40 years. We keep 16 maturities from 6 months to 30 years: some days lack the 40-year point. 60 days is 7.8 KB (2.5 KB compressed).
- **Script.** `scripts/gilt_curves.py` (Python, needs `openpyxl`, the only extra dependency, for data prep only). Daily runs download the current-month file (about 450 KB) and merge it into the committed history. The 39 MB yearly archive is only used to fill a short history. Still to do: a daily GitHub Action to run it and commit the result (Phase 5 or 11).
- **IADB quirk.** The database URL now redirects (302); follow redirects if it is ever used.
- **Drawing.** 2D canvas, not WebGL, for the prototype: far less code, easy to explain. 60 real curves, with three extra strands blended between neighbouring days for a silk look (237 strands on desktop, 60 on touch devices). Monotone cubic interpolation, so the curve never overshoots the data. The latest curve is gold, at the front.
- **Colour.** Four new tokens, `--ribbon-back` (periwinkle), `--ribbon-iris` (violet, new), `--ribbon-mid` (signal) and `--ribbon-front` (deep blue), read by the component. A faint 28px wash under every sixth strand gives the sheet a body of colour that still follows the data.
- **Composition.** The sheet sweeps up from the lower middle to the top right, behind the cards, and fades out over the left 38–62% so the headline sits on a clean ground. On phones it runs across the top at 35% opacity. Headline on four lines (column 1.45fr), and the glass key-figure card has the ribbon behind it so the glass actually shows.
- **Performance** (production build, headless Chrome, software canvas): desktop 60 fps. With the CPU slowed 4×, 18 fps at first, then 35 fps after adding adaptive quality (if the first 60 frames average over 24 ms, it draws every other strand and drops the wash). Phone width with a slowed CPU: 43 fps. If real phones struggle, port to WebGL in Phase 5.
- **Behaviour verified:** draw-in (oldest first, gold last, about 1.9 s), slow ripple, strands part around the cursor and spring back, pauses off screen and when the tab is hidden, and under reduced motion draws the final state once and never moves.
- **Caption** says "the latest close, 29 October 2026, is in gold" rather than "today's", because the Bank's data lags by a day or more.
- **Not yet built:** the hover tooltip on the gold curve, card tilt and the settle-in on load (Phase 5), and a replacement for the third hero card.
- **Dev server gotcha.** A long-running `next dev` served a stale `globals.css` after edits (new tokens missing). Restart it if styles look out of date. Screenshots now use a production build so they can't be affected.

## Hero options (1 November 2026)

- Padraig approved: 2D canvas for the ribbon (not WebGL), `openpyxl` for the data script, the new violet `--ribbon-iris`, and Stirling as a hero card (now moot).
- **Hero cards removed.** Padraig did not like the floating cards in the hero. The key-figure and prediction cards are out of the hero; the hero is headline, subline, buttons and one graphic.
- **Four options built for Padraig to choose from**, at `/lab/heroes`: ribbon (sheet up the right), horizon (sheet edge to edge across the lower half), scrub (one large real curve that replays 60 days and can be dragged through) and on the record (the live prediction as the headline with a gold countdown).
- `GiltRibbon` takes a `layout` ("side" or "horizon"). The curve maths is shared in `lib/curves.ts`.
- **Container bug fixed.** `box-content` plus `w-full` overflowed inside flex layouts on phones. Container is now `w-full` with a max width that includes the gutters.
- Weakness noted for "on the record": the gold bar is empty until the prediction's made date has passed, and it stays near empty for weeks after launch.

## Hero options, second round (1 November 2026)

- **Padraig's feedback on round one:** ribbon and horizon were the same idea, and scrub and on the record were "a chart in the hero" and not interesting. The test to apply: would the lead designer at Stripe, Apple or Supabase, or a designer building their own portfolio, ship this? All four were removed (they stay in git history).
- **Round two, at `/lab/heroes`:**
  - **A. Object:** an Apple-style product shot. Weekly gilt curves since January 2025 form a lit, solid 3D surface with walls, a soft floor shadow and the latest close as a gold front edge. It rises from flat on load, turns slowly and leans to the cursor. Each week is averaged with its neighbours to remove a comb of spikes on the 30-year side; the latest curve stays exact, and the caption says so.
  - **B. Constellation:** the same surface as about 14,000 additive points of light on night blue, rendered with WebGL point sprites. Low yields violet, high near-white, latest week gold. The dark option.
  - **C. Slice:** a full-bleed WebGL shader of flowing colour (domain-warped noise in ink, deep blue, signal, violet and periwinkle). Its top edge is the latest yield curve in gold, with the eight previous weeks as faint lines above, and the cursor lights the colour. Gold filaments inside the colour turned muddy and were replaced with very faint white threads.
- **New data:** `scripts/gilt_surface.py` writes `public/data/gilt-surface.json`, every fifth trading day since January 2025 (67 curves, 7.6 KB, 2.1 KB compressed).
- **New shared code:** `lib/webgl.ts` (shaders, matrices, colour tokens), `lib/surface.ts` (surface grid, smooth across maturity and time, optional averaging) and `lib/useCanvasLoop.ts` (render loop, pause off screen, reduced motion, eased cursor). Nav gained a `tone="night"` option.
- **Not yet measured:** frame rate on real devices. Headless Chrome renders WebGL in software, so its numbers would mislead. Measure on a phone and a laptop in Phase 5.

## Hero options, third round (1 November 2026)

- **Padraig's feedback on round two:** a wider range, but every option was still "the data, drawn differently". He liked the darkness of Constellation and said the ribbon was the best idea, so the dark ribbon is now an option. He asked for ideas that do not involve market data, thinking well outside the box. Object, Constellation and Slice, and their WebGL code and surface data, were removed (in git history).
- **Round three, at `/lab/heroes`:**
  - **Dark ribbon:** `GiltRibbon` with `tone="night"`. Lighter colour ramp (deep blue to near-white at the front) drawn with additive "lighter" compositing, so dense parts of the sheet glow. 25% opacity on phones so it doesn't fight the headline.
  - **Torch:** the first essay's text (from `lib/essayText.ts`, Padraig's words exactly) fills the page, nearly invisible. A radial CSS mask follows the cursor and reveals it; after 2.5 s without movement, and on phones, the light drifts by itself. A soft shade keeps the headline column clean. A glow around the headline was tried and rejected: it made the letters look fuzzy.
  - **Lens:** a glass loupe follows the cursor over the 88px headline. Inside is a 1.6× copy of the same text, positioned so the point under the centre lines up, with a red and blue fringe at the rim (`--fringe-warm` and `--fringe-cool`). Pure DOM, so the text stays crisp. Kept inside the headline's box; it drifts when idle.
  - **Questions:** the questions from the project case studies in 04-content.md (APEX, The Slate, Portfolio Optimiser, Portfolio Risk Dashboard), in large type on rows that drift in alternating directions at different speeds (CSS `marquee` keyframes). Hover or focus stops a row and turns it blue; each row links to its project. Screen readers get each question once.
- **Build note:** `essayText` reads from a fixed folder (`build-kit/content/posts`). A variable path made Turbopack trace the whole project into the server bundle.

## Hero decision (1 November 2026)

- **Chosen: the dark ribbon.** Night ground with the blue glow, and the gilt ribbon in its night tone up the right-hand side. No hero cards. Kit docs 02, 03 and 05 updated.
- **Torch** is planned for the homepage contact panel (Phase 6), as a quiet discovery rather than a feature. Padraig: "don't force it if it doesn't work". Drop it if it competes with the email link.
- **Not chosen:** Lens and Questions. Their components remain in `components/` until Phase 6. Questions could still work as the projects band intro; delete whatever is unused by Phase 10.

## Phase 3: content layer (1 November 2026)

- **MDX** is compiled on the server with `@mdx-js/mdx` (`lib/mdx/render.tsx`), with frontmatter read by `gray-matter`. Not `@next/mdx`: it does not read frontmatter, and with Turbopack it cannot take our own remark or rehype plugins as functions. Plugins: `remark-gfm` (footnotes) and `rehypeKeepRanges` (word joiners in number ranges, in every piece of text).
- **Validation:** zod schemas in `lib/content/schemas.ts`. `validateContent()` runs from `app/sitemap.ts`, so every build checks everything. A deliberately broken file was tested: the build stops with "Invalid content in content/projects/apex.mdx … at title".
- **Cross-checks:** each essay's `predictionId` exists; each prediction points to a real essay; each prediction's claim appears word for word in its essay (case-insensitive), so claims can't drift from what was published.
- **Footnotes** become sidenote data (`lib/content/footnotes.ts`), numbered in the order first cited. Definitions must be single-line, and orphan references or sources throw.
- **Project files** use the 04-content.md text exactly. Changes: curly quotes and apostrophes, "Label: text" split into a heading and a paragraph with the first letter capitalised, "Ledoit–Wolf" with an en dash. Stirling's "live (updated daily)" is `status: live` plus `statusNote`.
- **Prediction 001** has a `judging` field: the rule decided at Padraig's request in Phase 0. It will be public on the Ledger.
- **Not placed:** "this was Padraig's first ever coding project" (Portfolio Optimiser), written in the third person in 04, needs his own wording if wanted. The project "Graphic:" descriptions are build specs for Phase 7, not copy.
- **Tooling:** `@types/node` moved to 24.x (Vitest 5 needs 22 or later), and `engines.node` is now `>=22`. Unit tests live next to the code (`lib/**/*.test.ts`); Playwright keeps `tests/`. The Vitest config is `.mts` to avoid Vite's CommonJS warning.
- **RSS is hand-written** (`app/rss.xml/route.ts`), about 30 lines, rather than adding a package. The site URL comes from `NEXT_PUBLIC_SITE_URL`, falling back to the suggested domain.

## Phase 4: shell (1 November 2026)

- **Decisions shown in context later**, at Padraig's request: The Slate's "boost" wording (case study, Phase 7), the prediction judging rule (Ledger, Phase 9), "first ever coding project" (Portfolio Optimiser case study, Phase 7), and the footer credit (now).
- **Route group:** every public page is under `app/(site)/`, sharing `(site)/layout.tsx` (skip link, `SiteNav`, `<ViewTransition>` around `<main>`, `Footer`). `/lab` stays outside the group, so its demos have no shell. `app/not-found.tsx` renders the shell itself.
- **Nav tone follows what is underneath:** any element with `data-nav-tone="night"` (hero, projects band, footer) turns the bar night-toned while it sits under the bar's midline. Night glass is `glass-bar-night`.
- **Backdrop-root bug, fixed:** `view-transition-name` on the nav's fixed wrapper made it a backdrop root, so the glass blurred nothing. The name now sits on the `<header>` itself (`Nav pinned`), and only on the live nav, because duplicate names (the lab has two navs on one page) abort view transitions.
- **Mobile menu** is a native modal `<dialog>`: the browser traps focus, Esc closes it, focus returns to the menu button. It opens with `@starting-style` (`starting:` in Tailwind). The page behind is locked with `html:has(dialog[open])`. It closes on navigation because state stores the page it was opened on (no setState in an effect, which ESLint flags).
- **No Lenis**, as decided in Phase 0: smooth scrolling hijacks native scroll and breaks anchor jumps to footnotes.
- **Page transitions:** React `<ViewTransition>` with a 200ms cross-fade, header pinned, instant under reduced motion. Verified: `document.startViewTransition` fires on a link click.
- **Cache Components and dynamic routes:** `dynamicParams` is not allowed. Unknown slugs call `notFound()`, but because the static shell has already started streaming, `/writing/nope` keeps status 200 with `<meta name="robots" content="noindex">` and the 404 content (documented Next behaviour). Unmatched paths such as `/nope` return a real 404.
- **Built-by badge: Padraig wants the real one.** `public/built-by.js` is a copy of github.com/poggey/built-by (reviewed: no network requests apart from the GitHub avatar, everything escaped, shadow DOM styles), loaded with `next/script` `lazyOnload` from `components/BuiltBy.tsx`. `data-site` is left out because the visitor is already on the portfolio. Update the copy if the badge changes. Prettier ignores it. The footer keeps everything on the left (with extra bottom padding on phones) so the fixed badge never covers it.
- **Footer has no year.** `new Date()` cannot run during a static prerender, so it reads "© Padraig Middleton. London and Newcastle."
- **Layout** is at least a screen tall (`min-h-svh` flex column), so the footer sits at the bottom of short pages.
- **Screenshot gotcha:** Playwright's full-page capture resizes the viewport, which can catch the ribbon between frames and look like an unfinished draw-in. A normal viewport capture after scrolling away mid-load shows it complete.

## Phase 5: hero (2 November 2026)

- **Data** refreshed to the 30 October 2026 close. `.github/workflows/gilt-curves.yml` runs `scripts/gilt_curves.py` at 11:30 UTC Tuesday to Saturday and commits if the curves changed, which redeploys on Vercel. It only runs once the repo is on GitHub.
- **Gold-curve tooltip:** hovering within 16px of the gold curve's visible part shows a glass label at the nearest real data point ("30 October 2026, 6-year 4.96%") with a gold dot. The gold curve is exempt from the cursor push, so it holds still while the other strands part. Keyboard: a visually hidden button ("Latest gilt yields", `aria-describedby` the tooltip) shows it at the 10-year point. It works under reduced motion. The tooltip is a fifth use of glass, the exception agreed in Phase 0.
- **No JavaScript:** `GiltRibbonStatic` (every third day plus the latest close, SVG) inside `<noscript>`.
- **Nav first-paint bug, fixed:** tone was detected only after hydration, so the bar was dark-on-dark over the hero on first paint and without JS. `SiteNav` now starts night-toned on pages listed in `darkTop` (the homepage).
- **Load sequence verified:** text readable at first paint; oldest curves from about 600ms; complete with gold by 2000ms.
- **Measurements** (production build, three runs each):
  - LCP: the headline `h1`. 44ms desktop; 688ms with 4× CPU and slow 4G. Budget 2.0s. Pass.
  - CLS 0.000.
  - Hero JavaScript: about 6 KB gzip for the ribbon chunk, plus 2.5 KB data. Budget 40 KB. Pass.
  - **Homepage JavaScript: 197 KB gzip. Budget 150 KB. Fail.** About 125 KB is the framework (React DOM, the Next router runtime and Turbopack), 44.7 KB is Motion (`domMax` via `MotionProvider` on every page), and the rest is the ribbon, menu, view transitions and badge. Proposed to Padraig: replace Motion with the browser's View Transitions API and CSS for its three jobs (tab indicator, filter reflow, chart reveal). That drops to about 152 KB, then trim the rest.
- **Headline options** for Padraig to choose in context: `/lab/headlines` (A, B, C in the real hero). B is in use.
