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

## Phase 6: homepage sections (2 November 2026)

- **Headline B confirmed** by Padraig.
- **Motion removed** (Padraig: "as long as the end product is the same, and there is motion on the page"). Its jobs now:
  - Tab indicators: one absolutely positioned element moved with a CSS transition (`Tabs`, horizontal or vertical). It only animates after first placement.
  - Panel swaps (Ledger toggle, experience detail, lab filter reflow): React `<ViewTransition>` with `startTransition`.
  - Chart and bar reveals: `lib/useInView.ts`. Reduced motion: `lib/useReducedMotion.ts`, which also follows the lab's `data-motion` switch.
  - Page transitions moved into `PageTransition`, keyed by path, with `default="none"`, so in-page updates do not cross-fade the whole page.
  - Homepage JavaScript went from 197 to 156 KB gzip. The remaining 6 KB over budget is for Phase 10.
- **Sections:**
  - **Writing:** the essay card with the chart panel and glass £15bn chip, chart data from `content/charts/*.json` via `getChart` (validated, and checked in `validateContent`). Beside it: "Next essay in progress." and "All essays".
  - **Projects:** a marked slot for Phase 7.
  - **Ledger:** the idea and the record as a sentence on the left, the card with the Open/Resolved toggle on the right. The progress bar fills when on screen. On 2 November it is empty because the prediction is dated 3 November.
  - **Experience:** vertical role tabs with a sliding indicator; the detail panel cross-fades. Education card with the CV button.
  - **Contact:** the night panel running into the footer, with the torch behind it (`Torch quiet`: fainter writing, smaller light, drifts on its own). The email wraps only at the @ on phones.
- **Footer** gained a faint top hairline so it separates from the night contact panel.
- **Kit and CLAUDE.md** stack line updated: no `motion`, GSAP or Lenis; 2D canvas hero.

## Ledger removed (2 November 2026)

- Padraig: "I can still make predictions at the end of my writing but I don't want to have to come back to it." Removed the homepage Ledger section, `/ledger`, the nav link, the sitemap entry, `LedgerPreview` and `lib/ledger.ts`. Kit docs 03 and 05 marked.
- The Writing intro was trimmed to "Opinionated, sourced, and every essay ends with a dated prediction." (words removed only).
- Kept: `content/predictions.json` and its validation (the claim must match the essay word for word), for the essay's prediction card in Phase 8. That card should show the claim and when it can be checked, with no status or tracking.
- Left in the lab: `ProgressBar`, `StatusChip` and `useToday`, which nothing on the site now uses. Delete them in Phase 10 if still unused.

## Phase 7: projects (2 November 2026)

- **Export scripts** in `scripts/project-graphics/` (README there): each reads a clone of the project's repo (outside this project) and writes `public/data/projects/<slug>.json`. All files are under 14 KB, and a unit test enforces the 30 KB limit.
  - **Risk Dashboard:** the dashboard's own `src/metrics.py`, loaded by path, run on the Multi-Asset preset, equal weight, five years to 30 October 2026. Result: +24.6%, max drawdown −19.6% (December 2021 to September 2024), 95% one-day VaR −0.94%. The spec's "dashed VaR line" was dropped: a one-day VaR cannot sit on a cumulative-return axis, so it is a label.
  - **Portfolio Optimiser:** re-run of the notebook. It matches exactly (Sharpe 0.763, equal weight −0.314, 56% gold / 44% global equity) only with **dividend-adjusted** prices (`auto_adjust=True`, newer yfinance's default); raw closes gave 0.70. The notebook had no random seed, so the 800-point cloud is a seeded fresh draw; the frontier and optimum don't depend on it.
  - **The Slate:** histogram of ROI in 10 bins for the 58 core films; bins holding the top five earners in gold. The kit's $1.62bn and −$37m are in **constant 2025 dollars** (portfolio.ipynb deflates by CPI); nominal figures are $1.53bn and −$59.8m. TODO on the case study.
  - **Stirling:** the three latest **weekday** editions. Weekend editions repeat Friday's story (Nos. 120 and 121 had the same headline), which may be worth fixing in Stirling. Headlines are joined from `headlinePlain` and `headlineEm`, exactly as published.
  - **APEX:** the teammate network from `analysis/apex.json` (40 drivers, 65 links), with a seeded force layout computed in Python. The highest-rated driver is in gold.
  - **Escape Velocity:** the repo now has **live** prices (`is_stub: false`, 19 trading days to 10 July 2026). Drawn with the $135 IPO line; card and page carry a visible TODO until Padraig confirms. The script refuses stub data. No case study text exists yet (TODO).
  - **Marginalia:** the "test fixtures" are a synthetic test reader. The graphic is the recommender's real output for that reader (shortlist with predicted rating ± band), labelled as such; TODO asks Padraig.
- **Graphics** are server-rendered SVG (`components/project-graphics/`), with three sizes: card 400, wide 600 (full-width card, large screens only), page 800 (shallower). They draw in once via `Reveal` (pending, then done at 40% visible), using CSS: `data-draw` strokes, `data-grow` bars, `data-fade` labels. Without JS they are simply visible. JS cost: about 2 KB in total.
- **Homepage band:** five projects (`homepage` frontmatter; Escape Velocity and Marginalia are false). Rows pair a feature with a standard card on alternating sides; a leftover standard spans the full width. `/projects` shows all seven with filter tabs, and tiles move with named view transitions.
- **Case study page:** header (kind, title, one line, status, year, stack, live and GitHub buttons), the large graphic in a night panel with its source, the key result, the MDX write-up and a "Next project" link. `<Todo>` is an MDX component for review notes, which must be gone by launch.
- **Bugs found while reviewing:** the Stirling stack showed back cards' headlines; the Max Sharpe label sat on the frontier; side graphics used too large a drawing box; and the risk drawdown band read as a grey box (removed, the gold segment carries it).

## Phase 8: essay page (2 November 2026)

- **Layout.** A 680px reading column, centred, with the header centred above it. Figures (the chart and the slider) break out to 960px or the screen width less the gutters (`essay-wide`: the article is a size container, so `100cqw` is the page width without the scrollbar).
- **Sidenotes** (`lib/mdx/rehypeSidenotes.ts`, `components/essay/Sidenote.tsx`). The plugin replaces each footnote reference with `<Sidenote>` carrying its source, and turns the footnote list into `<Sources>` without the ↩ links. No JavaScript:
  - From 1312px (the `notes` breakpoint: 680 + a 40px gap + 240px of notes, each side) the note floats into the right margin beside the line that cites it, Tufte style. Floats with `clear: right` stack without overlapping. Hovering a note or its number highlights the other.
  - Below 1312px the number is a button that opens the note with the browser's popover API as a card at the bottom of the screen (like Wikipedia's mobile references). Esc or tapping outside closes it; Tab moves into it. Laptops at 1280px get the popover, which keeps the column centred at every width.
  - Every citation shows its source, so a repeated source appears again in the margin (OBR three times). Short notes make this tolerable; revisit if an essay cites one source ten times.
  - Gotcha: Tailwind's preflight sets `sup { line-height: 0 }`, which gave the button no height. It has `leading-none`.
- **Drop cap: cut.** `::first-letter` takes the apostrophe with the I, so the opening read as a large "I’" then "ve heard". As agreed in Phase 0.
- **Prediction card.** The essay's own paragraph ("My prediction: …") is now the card's content: `<Prediction id="001">` wraps it in the MDX (markup only, words unchanged). That avoids printing the claim twice. The card adds the made date, the check date and a "How it will be judged" disclosure with the judging rule (this is where Padraig sees it in context). No status, no countdown, no Ledger link.
- **"Where could I be wrong?"** stays a plain paragraph (Phase 0 decision). `WhereIMightBeWrong`, `PullQuote` and `Figure` exist for later essays but aren't used yet.
- **Chart:** the line chart labels the first point, the highest actual (the 2022–23 peak the text mentions) and the last forecast in gold. On phones only the end years show under the axis; the middle one collided.
- **HeadroomSlider:** exactly the spec's labels and result lines (`lib/headroom.ts`, unit tested). A tick on both bars marks the £15bn headroom. The slider's `aria-valuetext` carries the whole result, so no separate live region.
- **Reading progress:** `ReadingProgress` renders inside the nav on `/writing/[slug]`: a 2px blue line along the bar's bottom edge and "x min left" in the middle from 1024px. Decorative, hidden from screen readers.
- **Share:** "Copy link" (both labels share one grid cell, so the width never changes; a polite live region says "Link copied") and "Share on LinkedIn ↗" (LinkedIn's share-offsite URL).
- **Open Graph image** (`opengraph-image.tsx`, helpers in `lib/og.tsx`): night ground, the curve slice (real data) on the right with the latest curve in gold, number, title, the first key figure on a chip, and the domain. Fonts are static Schibsted Grotesk TTFs in `assets/fonts/` (OFL), because next/og can't read woff2 or variable fonts. Colours are repeated in `lib/og.tsx` since images can't read CSS variables. Twitter card is now `summary_large_image` site-wide.
- **Measured** (production, essay page): LCP 56 ms desktop and 780 ms on a throttled phone; the LCP element is the first paragraph. CLS 0.
- **JavaScript on the essay page: 166.4 KB gzip, over the 150 KB budget.** About 8 KB is the essay's own (slider, copy link, chart). About 9.5 KB is a chunk Turbopack shares with the homepage (Torch, experience tabs, Reveal) that the essay doesn't use. Phase 10: split that chunk, then trim the rest.

## Phase 9: remaining pages (2 November 2026)

- **`/writing`:** heading and intro, then each essay as a card (number, date and reading time on the left; title, standfirst and tags on the right; the whole card is the link). Then "Next essay in progress." with a "Follow by RSS" link. **Tag filters** (`EssayList`, the same Tabs and view transitions as `/projects`) appear only once there are two or more essays; with one, a filter would hide nothing.
- **`/about`:** bio, then visible TODOs for Padraig's own paragraph and the headshot (each one switches to the real text automatically once the `TODO(Padraig):` prefix is gone from `site.json`), CV and LinkedIn buttons, then Experience, Education, Skills and Beyond work. Each has its heading in a narrow left column from 1024px, every role in full, and the Parkdean "around 25 or 30" TODO shown as a highlighted note under its bullet. It ends with the night contact block.
- **Contact block** split out as `ContactDetails`: the homepage wraps it in the torch, About uses it plain (no torch, so About doesn't load it).
- **404:** "Page not found", "This page doesn’t exist.", a link to the latest essay (most shared links are to essays, so a mistyped one most likely meant that), then Writing, Projects and Home buttons.
- **`/projects`** was finished in Phase 7; the Ledger is gone.
- **Command menu: skipped.** It's a stretch goal, and it would add JavaScript to every page while the site is already over the 150 KB budget.
- Deleted `components/Stub.tsx` (no stubs left).

## Phase 10: polish and critique (2 November 2026)

- **Parkdean:** "around 25" advisors, confirmed by Padraig. TODO removed.
- **Design lab deleted** (`/lab`, the hero and headline experiments, and everything only they used: Lens, QuestionRows, ProgressBar, StatusChip, Stat, Card, GlassPanel, Switch, Tooltip, useToday, contrast, the `data-force` and `data-motion` hooks). Its decisions are all live on real pages and recorded above; git history keeps the code.
- **JavaScript budget met.** Measured as the module chunks a page's HTML names, gzip -9, plus the badge (the `noModule` polyfill chunk is skipped by modern browsers and doesn't count). Browser "transferred" totals look higher because Next prefetches linked pages' code; those aren't part of the page.
  - Before: homepage 152.7 KB, essay 151.3 KB. After: homepage 147.8 KB, essay 149.0 KB, other pages 142 to 145 KB. Framework (React, router, runtime) is about 133 KB of that.
  - How: the badge loads with a plain `<script defer>` (no `next/script` loader); `LineChart` became a server component revealed by `Reveal` and CSS (`data-wipe`), so `useInView` went; the gilt data is passed to the ribbon as a prop instead of bundled (also means the daily data refresh no longer changes the JS file); the unused "horizon" ribbon layout went; "x min left" went (see below).
- **Critique fixes:**
  - Homepage: the boxed "Next essay in progress." looked like a placeholder; now a plain line with "All essays" and "Follow by RSS". The hero caption is balanced (no "of England." orphan).
  - Case study: the write-up sat in a narrow left column with the right half empty. The key result now sits on the right, sticky, beside the write-up.
  - `/projects`: card titles are h2 there (h3 under a section heading on the homepage), so headings don't skip a level.
  - Small link targets made 44px tall: footer RSS, "All essays" (essay and homepage), "Follow by RSS".
- **"Remove one accessory":**
  - Essay: "x min left" in the nav. The line already shows progress, and for a 3-minute essay the count added nothing.
  - About: the LinkedIn button at the top (the contact block below has it).
  - 404: the "Page not found" label above the heading (the heading says it).
  - Homepage: the placeholder card's border and fill.
  - Writing, projects, case studies: nothing left to remove that wasn't content.
- **Social images** for every page. `lib/og.tsx` holds one frame; essays and projects have their own `opengraph-image.tsx`, and every other page uses `/social.png` (name and headline) via `pageMetadata`. Gotchas: a page's `openGraph` replaces the layout's whole object (so `siteName` and `locale` are repeated in `pageMetadata`), and setting `images` in metadata overrides an `opengraph-image` file (hence `ownImage`). Project images use the curve slice, not each project's own graphic as the spec suggested: the graphics are HTML and Tailwind, which next/og can't render.
- **`PUBLISHING.md`** written. Tested end to end with a temporary essay No. 2 (deleted, never committed): it appeared on `/writing`, the homepage, RSS and the sitemap with its own preview image, and the tag filters appeared and worked by mouse and keyboard.
- **Lighthouse could not be run here** (downloading the CLI was blocked). Measured directly instead: LCP 56 ms desktop, about 0.82 s on a 4× slowed phone with slow 4G (the h1 on the homepage, the first paragraph on the essay); CLS 0 to 0.002; worst interaction 120 ms at 4× CPU; every page has one h1, ordered headings, named controls, a unique title, a canonical URL and `lang`; text contrast 5.1:1 or better everywhere.

## Before launch (2 November 2026)

- **Favicon:** option A of four (`screenshots/favicon-options.png`): a night square with two concave yield curves, an earlier one in faint blue behind and today's in gold in front, the hero ribbon in miniature. Rejected: a curve traced from the real data (lumpy at 16px, read as a generic "stock going up" icon), a single curve, "PM" (cramped at 16px) and "P." (the most common favicon pattern there is). Files: `app/icon.svg`, `app/favicon.ico` (16, 32, 48) and `app/apple-icon.png` (180, square, since iOS rounds the corners).
- **Domain:** none yet. `NEXT_PUBLIC_SITE_URL` falls back to `padraigmiddleton.com` until it's set.
- **CV:** published as supplied in `public/cv.pdf`. It has Padraig's mobile number in the header; he said that's fine for the CV (the site's own pages still never show it).

## Redesign after Padraig's design feedback (2 November 2026)

Padraig pointed to Stripe and to Oversight Supply's sections (supply.madebyoversight.com/sections, reviewed in a browser) for the feel: everything subtle, structured, nothing added as an afterthought. Not to be copied. What changed:

- **Ribbon:** fine even hairlines, no soft wash, edge to edge. A single left-to-right alpha fade (faint behind the headline, full on the right) replaces the hard cut-off mask, so the sheet passes under the text instead of stopping. It runs on behind the source strip and is cut by the hero's bottom hairline.
- **Guide lines** (`PageFrame`): two hairlines at the outer edges of the content column, full page height, over every section and the ribbon; every section has a hairline at its top (`--frame-line`, readable on light and night). Wide screens only.
- **Buttons:** 6px corners (`--radius-control`), no lift. Primary is solid signal blue with a chevron that nudges right on hover; secondary is an outline. Tabs and controls use the same radius; tags are 4px.
- **Homepage order:** hero, experience and education, writing, projects, contact. Experience is a ruled list with a blue bar on the selected role and its detail beside it; education sits on the same grid, ruled rather than boxed.
- **Writing:** the essay is shown as its own first page (number, tags, title, standfirst, byline, the opening paragraph fading out, "Read the essay"), so it plainly reads as an article. Option 2 (words beside the chart) is on `/review`.
- **Projects:** finance and economics work is the main body (`featured`); APEX and Marginalia are listed under "Also built". Option 1, an index with a preview panel, was live until 2 November 2026 (replaced by emblems, below); option 2, even cards, was rejected. Old bento, filters, tiles and `size` removed.
- **Essay:** the prediction card is gone (the prediction is a paragraph like any other), and with it `predictions.json`, its schema and checks. The chart and the slider sit in the reading column, ruled above and below. The slider reads as a sentence whose numbers move, and the slider itself carries the £15bn headroom mark and turns gold past it; option 2 (two bars) is on `/review`.
- **`/review`** held the alternative options while Padraig chose; it was deleted once he had.

## Design prototypes on /reviews (2 November 2026)

Padraig asked to keep the current site and see a few of the PROPOSITIONS.md directions built, then decide. Four are full homepages with the real content: A Intaglio, B Survey, C Trading day, E Axis. D (Folio) is not built: its best idea, the essay as a printed first page, is already on the live homepage.

- **Separate from the live site:** `app/reviews/` sits outside the `(site)` group (no site nav, frame or footer), is `noindex, nofollow`, and is not in the sitemap. Each prototype re-points the site's colour variables inside its own wrapper (`app/reviews/reviews.css`), so nothing reaches `globals.css`. A small bar at the bottom moves between them.
- **Shared data:** `lib/reviews.ts` (content and one key number per featured project) and `components/reviews/projectSeries.ts` (each project's exported data reduced to one drawable shape with one gold mark). Projects without a key result use a figure from their own data, labelled with what it is: the risk dashboard's largest drawdown (−19.6%), Stirling's edition count (120), Escape Velocity's first-day close against the IPO price (+19%, shown with a TODO because the figures are unconfirmed). Stirling's marks are all the same height: the data is a count, nothing more.
- **A Intaglio:** the rosette is 20 of the 60 gilt curves (every third day, plus today in gold), each wrapped into a closed loop in three bands with phase-shifted waves, so they cross into a lattice. Cached to an offscreen canvas and rotated (one turn in six minutes); lines near the pointer catch the light (a second copy masked by a radial gradient). Certificate borders are small repeating SVG patterns plus a shared corner rosette (`<symbol>`), seeded by the project: a first version that traced waves round the whole border was about 450 KB of SVG.
- **B Survey:** `scripts/reviews_gilt_history.py` builds `public/data/reviews/gilt-history.json`, one curve per week for ten years from the Bank of England archive. It starts at 1 year because the older files often leave out 6 months (`read_spot_curves` now takes a maturity list). Contours (marching squares, every 0.25 points) are drawn from a copy smoothed over about a month, because weekly noise drew vertical scribbles; the spot-height readout uses the published figure at the nearest published maturity.
- **C Trading day:** `palette.ts` blends sky, ground and ink by London time (night, pre-open, open, close, sunset, dusk) and is also inlined as a script so the first paint is right. The sky blends slowly; ground and text switch at the light-to-dark midpoint, because a continuous blend made unreadable grey text around 19:15. A slider previews other times (prototype only). The sun keeps to the right half of the sky and is hidden on phones, where it sat behind the headline.
- **E Axis:** the frame lines are the axes; yields tick up the left, maturities along the bottom (square-root scale), the curves sit high so the headline is in clear space beneath them, and on phones the plot is clipped to the band the curves occupy. The crosshair listens on the whole hero, since the headline otherwise blocks it. Section ticks and a gold reading tick on the left axis.
- **Tabular figures removed** in the prototypes: Schibsted's tabular full stop and comma leave visible gaps ("0 . 76").
- **Outcome (2 November 2026):** Padraig liked the ideas but chose to keep the current design. All of `/reviews` was deleted (it is in git at `38da64f` if any idea is wanted later); `read_spot_curves` went back to its fixed maturities.

## Projects as emblems (2 November 2026)

Padraig: the projects section's "enormous graphs and charts… looks like you're trying to fill the space… maybe not charts but graphics instead".

- **Emblems, not charts.** Each featured project has a small square drawing of the idea behind it (`components/project-emblems/`): a return distribution with its tail in gold beyond the VaR line (risk), two Fourier epicycles and the square-ish wave they trace (Fourier), the frontier with the capital market line touching it at the maximum Sharpe point (optimiser), a craft leaving orbit (Escape Velocity), a fanned stack of editions (Stirling), a film slate (The Slate). One 64-unit grid, thin lines in the current colour, one gold element each. They are drawings of ideas, not data, so nothing on them can be wrong; the real charts stay on the case studies.
- **Each moves once when its project is pointed at or focused** (rules under `data-emblem` in globals.css, timed by `--dur-emblem`, zero under reduced motion): the tail stretches (stress test), the epicycles turn (outer once, inner three times), the line sweeps up to the tangent, the path redraws to the craft, the stack fans, the slate's arm lifts and claps shut on leaving. Held states use transitions so they ease back; one-shot moves are animations from a start pose to the resting one, so leaving early only skips to the end.
- **Layout:** a ruled two-column index from `lg` (one column below, where two were cramped at 768), emblem left, kind, title with a chevron, one line. "Also built" uses the same ruled grid without emblems. The preview panel, `ProjectIndex` and `items.tsx` are gone; `ProjectGraphic` remains for case study pages.

## About page in Padraig's words (2 November 2026)

- **Islamic finance removed** as a "particular interest": Padraig says it is not true. Marked in `build-kit/docs/04-content.md` so it does not come back. The Raymond James bullet about building a Shariah-compliant model portfolio stays: that was real work.
- **Own words:** his paragraph is the first thing on `/about`, verbatim. The bio below it no longer repeats "second-year Economics and Finance student at Queen Mary" and starts at Newcastle.
- **No headshot** for now: the field is optional and the placeholder is gone.
