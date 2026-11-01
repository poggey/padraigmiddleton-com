# 06: Build phases

Twelve phases, 0 to 11. Paste each prompt into Claude Code in order. Every phase ends with screenshots and a stop. Do not move on until you are happy.

General tips for you (Padraig):
- Give feedback on specifics: "the card shadows are too heavy", "the headline wraps badly at 768px", "this feels like a template". Screenshot what you mean if you can.
- If something feels generic, say so and point to the "AI tells" list in `02-design-system.md`.
- If a session gets long and Claude Code starts drifting, start a fresh session and say: "Read CLAUDE.md and NOTES.md, we are in Phase X, here is where we are."

---

## Phase 0: Read and plan

**Goal:** Claude Code understands the whole brief and tells you its plan before writing any code.

**Prompt:**
```
Read CLAUDE.md, then every file in build-kit/docs/ in order, then look at every image in build-kit/references/.

Do not write any code yet. Reply with:
1. A summary of the site's goal and audience in five lines, so I know you've understood it.
2. Your understanding of the design direction in your own words, including the one signature element and the things we must avoid.
3. Anything in the kit that is unclear, contradictory or missing, as a numbered list of questions.
4. Any risks you see in the plan (technical or design), and what you'd do about them.
5. A list of every TODO(Padraig) item you found.

Then stop and wait for my answers.
```

**Done when:** you have answered its questions and agree with its summary.

---

## Phase 1: Project setup and tokens

**Goal:** a clean Next.js project with the design tokens, fonts and tooling in place.

**Prompt:**
```
Phase 1. Set up the project as specified in CLAUDE.md:
- Next.js (App Router) with TypeScript, Tailwind CSS v4, ESLint and Prettier. Pin versions.
- Load Schibsted Grotesk and Source Serif 4 with next/font/google.
- Put every token from build-kit/docs/02-design-system.md (colour, type scale, spacing, radii, elevation, glass, motion) into app/globals.css as CSS variables and expose them as Tailwind theme tokens.
- Check that Schibsted Grotesk supports tabular figures and report back.
- Create the folder structure from CLAUDE.md, an empty NOTES.md, and a README explaining how to run the project.
- Set up Playwright so you can take screenshots at 1440, 768 and 390 wide.
- Initialise git and make a first commit.

Show me a single test page with the type scale rendered, at all three widths, then stop.
```

**Done when:** the type scale screenshot looks right to you, and the fonts render properly on all widths.

---

## Phase 2: Design lab (the most important gate)

**Goal:** build every primitive and surface on one page, `/lab`, so you can approve the look before any real page exists.

**Prompt:**
```
Phase 2. Build a /lab route (excluded from the sitemap) that shows every design primitive from build-kit/docs/02-design-system.md and build-kit/docs/03-architecture.md, using real content from 04-content.md, not placeholder text:
- Colour swatches with contrast ratios, the type scale, spacing scale.
- Buttons (primary, secondary, ghost, external link) in every state: default, hover, focus, pressed, disabled.
- Chips, tabs with the sliding indicator, a toggle.
- Cards at each elevation and radius, on porcelain and on night.
- A glass panel over a busy background, and the nav bar in both its transparent and scrolled states.
- One project card on the night band with the cursor spotlight working (use a placeholder graphic area for now).
- One essay preview card with an overlapping chart panel and glass key-figure chip.
- The motion tokens demonstrated: hover, press, a tab switch, a layout reflow.
- Reduced motion behaviour (add a toggle on the lab page that simulates it).

Before showing me, take screenshots at three widths and critique them yourself against the "AI tells" list and the principles in 02-design-system.md. Fix anything that fails. Then show me the screenshots, list what you changed after your own critique, and stop.
```

**Done when:** you would be proud of these components in isolation. Iterate here as much as you need. Every later page is built from these parts, so this is the cheapest place to get the finish right.

---

## Phase 3: Content layer

**Goal:** essays, projects, predictions and experience load from `content/` with validation.

**Prompt:**
```
Phase 3. Build the content layer described in build-kit/docs/03-architecture.md:
- MDX for content/posts and content/projects, with frontmatter validated by zod. The build must fail with a clear error if a required field is missing.
- Markdown footnotes converted into sidenote data (we'll style them in Phase 8).
- content/predictions.json, content/experience.json and content/site.json loaded and typed.
- Create content/projects/*.mdx for all seven projects using exactly the text in 04-content.md. Where the kit says TODO(Padraig), keep the TODO visible.
- Move build-kit/content/posts/the-bill-britain-keeps-signing.mdx and build-kit/content/predictions.json into content/.
- Reading time computed at 230 words per minute.
- RSS at /rss.xml, sitemap and robots.
- Write unit tests for the loaders and schemas.

Show me: the list of content items loaded, the test results, and any content you could not place. Then stop.
```

**Done when:** tests pass and the data matches `04-content.md`.

---

## Phase 4: Shell

**Goal:** navigation, footer, page transitions and smooth scrolling across empty pages.

**Prompt:**
```
Phase 4. Build the site shell from 02-design-system.md and 03-architecture.md:
- Nav: transparent at the top, glass with a hairline after 8px of scroll. Active section indicator. "Download CV" button. Mobile: a menu button that opens a glass sheet with focus trapped.
- Footer: copyright, location, RSS, and the built-by badge from github.com/poggey/built-by.
- Empty route stubs for every page in the sitemap, each with the correct metadata.
- Lenis smooth scrolling, disabled under reduced motion.
- View Transitions API cross-fade between pages (200ms), with a graceful fallback.
- A skip-to-content link and visible focus rings everywhere.

Screenshot the nav in both states at three widths, the mobile menu open, and the footer. Test keyboard navigation through the whole shell and tell me the result. Then stop.
```

---

## Phase 5: The hero

**Goal:** the signature moment. Take your time on this phase.

**Prompt:**
```
Phase 5. Build the homepage hero exactly as specified in build-kit/docs/05-signature-moments.md, section 1, with the layout from 03-architecture.md and copy from 04-content.md.

Step 1: inspect github.com/poggey/stirling-report and tell me how it fetches gilt yields and which maturities are available. Propose the data script. Wait for my OK.
Step 2: write the data script and commit a real snapshot to public/data/gilt-curves.json.
Step 3: build the WebGL curve field: depth stacking, today's curve in gold, load draw-in, slow drift, cursor displacement with spring return, gold-curve hover tooltip, pause when off screen. Then the SVG fallback and reduced-motion state.
Step 4: the headline, subline, buttons and caption. Show me the three headline options from 04-content.md rendered so I can pick.
Step 5: the three floating cards with depth, slight overlap, tilt towards the cursor, and their settle-in on load.

Record a short screen capture (or a sequence of screenshots at 0ms, 600ms, 1200ms, 2000ms) of the load sequence. Measure LCP and the hero's JS size and report both. Then stop.
```

**Done when:** you watch it load and it makes you want to show someone.

---

## Phase 6: Homepage sections

**Goal:** the rest of the homepage, apart from the projects band.

**Prompt:**
```
Phase 6. Build the homepage sections from 03-architecture.md using the Phase 2 components: proof strip, writing section (essay feature card with overlapping chart panel and the honest "Next essay in progress" slot), Ledger preview (with open/resolved toggle and progress bar), experience tabs with the detail panel and education card, and the contact panel with a faint echo of the curve field.

Copy comes only from 04-content.md. Motion only as allowed in 02-design-system.md: no fade-up on every section.

Leave a clearly marked slot for the projects band (Phase 7). Screenshot the full homepage at three widths, critique it against the AI-tells list and fix what fails, then show me and stop.
```

---

## Phase 7: Projects

**Goal:** the dark projects band with real miniature graphics, and the case study pages.

**Prompt:**
```
Phase 7. Build the projects work from 05-signature-moments.md section 2 and 03-architecture.md.

Step 1: for each project, write the export script in scripts/project-graphics/ and produce the JSON in public/data/projects/. Some need the project's repo: clone it to a temporary folder outside this project, run what is needed, and copy only the small JSON output. If a project's data is not available (Escape Velocity in particular), use a title card, never fake data. Tell me what you could and couldn't export before building the graphics.
Step 2: build each ProjectGraphic component, drawing in once when 40% visible.
Step 3: the projects bento on the night band with the two card sizes and varied anatomies, the cursor spotlight, and filter tabs with a layout reflow.
Step 4: the /projects/[slug] case study template, with the larger graphic and the sections from 04-content.md.

Screenshot the band at three widths, each filter state, and two case study pages. Then stop.
```

---

## Phase 8: Essay page

**Goal:** the best reading experience you can make, because most LinkedIn visitors land here.

**Prompt:**
```
Phase 8. Build /writing/[slug] as specified in 03-architecture.md and 05-signature-moments.md section 3, using content/posts/the-bill-britain-keeps-signing.mdx.

- Centred header with chips, title, standfirst, byline, copy-link and share buttons.
- Key figures overlapping the header's bottom edge.
- Source Serif 4 body at the specified measure, drop cap, pull quote styling.
- Sidenotes on wide screens, tap-to-open notes on mobile.
- The debt interest Chart and the HeadroomSlider interactive.
- Where I could be wrong, the Prediction card with days remaining, Sources, author card, next and previous links.
- Reading progress in the nav.
- Generated Open Graph image for the essay as specified in section 5.

Do not change any of the essay's words. Screenshot the essay top to bottom at three widths, the slider at 0, 1.5 and 3 points, and the OG image. Then stop.
```

---

## Phase 9: Remaining pages

**Goal:** `/writing`, `/projects`, `/ledger`, `/about`, and a useful 404.

**Prompt:**
```
Phase 9. Build the remaining pages from 03-architecture.md: /writing (with tag filter), /projects (full grid), /ledger (record, filters, rules note), /about (bio, experience, education, skills, beyond work, CV link; keep TODO(Padraig) for the personal paragraph and headshot), and the 404 page.

If everything is solid, build the command menu from 05-signature-moments.md section 6. If not, skip it and say so.

Screenshot every page at three widths. Then stop.
```

---

## Phase 10: Polish and critique

**Goal:** the difference between good and excellent. Expect this to take as long as a build phase.

**Prompt:**
```
Phase 10. Polish pass. Work through build-kit/docs/07-quality-bar.md item by item and report each as pass or fixed.

Then do a design critique as if you were a senior designer who has never seen the site: screenshot every page at 1440 and 390, and for each one list the three weakest details (spacing, alignment, type rag, inconsistent radii or shadows, motion that doesn't earn its place, copy that sounds generic). Fix them. Then apply the "remove one accessory" test to each page.

Finally run Lighthouse on the homepage and the essay (mobile and desktop) and report the scores. Show me before and after screenshots of everything you changed. Then stop.
```

---

## Phase 11: Launch

**Goal:** live on the real domain and ready for the first LinkedIn post.

**Prompt:**
```
Phase 11. Prepare for launch:
- Connect the Vercel project and the domain (I will buy it and give you access; walk me through the DNS steps).
- Metadata, canonical URLs and OG images verified on every page.
- Vercel Analytics on, tracking essay views and outbound clicks to LinkedIn, GitHub and the CV.
- The gilt-curve data refresh scheduled and tested.
- A final check that no TODO(Padraig) is visible on any public page. List any that remain.
- Test the essay link in LinkedIn's Post Inspector and show me the preview.
- Write PUBLISHING.md: how I add a new essay, add a prediction, resolve a prediction, and add a project, step by step.

Then stop.
```

---

## Prompts for later

**Publishing a new essay**
```
Read CLAUDE.md and PUBLISHING.md. I've added content/posts/<file>.mdx. Validate it, check the frontmatter, typography (curly quotes, en dashes in ranges, no em dashes), footnotes and links, but do not change my wording. If the essay needs an interactive or chart, propose one in line with 05-signature-moments.md section 3 and wait for my OK. Add the prediction to content/predictions.json. Show me the essay page and the OG image at three widths.
```

**Resolving a prediction**
```
Prediction <id> is due. Here's what happened: <outcome and source>. Update content/predictions.json (status, resolvedOn, outcome, evidenceUrl only; never touch the claim). Show me the Ledger and the essay's prediction card.
```

**When something looks generic**
```
This part looks generic: <describe or screenshot>. Check it against the AI-tells list and the principles in 02-design-system.md, tell me which ones it falls into, propose two alternatives, and wait for me to choose.
```
