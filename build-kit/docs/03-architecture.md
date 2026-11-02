# 03: Architecture

## Sitemap

| Route | Page | Notes |
|---|---|---|
| `/` | Homepage | The showcase. Spec below. |
| `/writing` | All essays | Newest first, filterable by tag |
| `/writing/[slug]` | Essay | The most visited page (LinkedIn traffic lands here) |
| `/projects` | All projects | Full grid, same cards as the homepage |
| `/projects/[slug]` | Project case study | One per project, written up like a short essay |
| ~~`/ledger`~~ | ~~The Ledger~~ | Removed 2 November 2026 at Padraig's request |
| `/about` | About | Longer bio, experience, education, skills, CV download |
| `/cv.pdf` | CV | Static file in `public/` (`TODO(Padraig)`: supply PDF) |
| `/rss.xml` | RSS feed | Essays only |
| `/sitemap.xml`, `/robots.txt` | SEO | Generated |
| `404` | Not found | Short, useful: links to Writing, Projects, Home |

Every page shares the navigation and footer. Navigation items: Writing, Projects, Ledger, About, and a "Download CV" button.

## Homepage, section by section

The wireframes show structure only. Proportions and styling come from `02-design-system.md`.

### 1. Hero

> **Decided 1 November 2026 (supersedes the wireframe below).** The hero is dark: the night ground with the projects band's blue glow, and the gilt-curve ribbon (`components/GiltRibbon.tsx`, `tone="night"`) sweeping up the right-hand side, glowing where the curves overlap. Headline (option B), subline, two buttons and the data caption. **No floating cards** in the hero. The prototype is `/lab/heroes/dark-ribbon`. Rejected alternatives and why are in `NOTES.md`.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [P] Padraig Middleton          Writing  Projects  Ledger  About  [Download CV] │  ← nav, transparent until scroll
│                                                                            │
│  ~~~~~~~ gilt yield curves fill the whole hero, fading out to the left ~~~ │
│                                                                            │
│  Headline (display)                         ┌──────────────┐               │
│  two or three lines                         │ key figure   │ ← glass card  │
│                                             │ from latest  │               │
│  Subline (lead): course, university,        │ essay + mini │      ┌──────┐ │
│  what he is looking for                     └──────────────┘      │ 650+ │ │
│                                                  ┌──────────────┐ └──────┘ │
│  [Read the latest essay]  [See the projects]     │ open         │          │
│                                                  │ prediction   │ ← night  │
│                                                  └──────────────┘   card   │
│  Caption, bottom left, small: "UK gilt yield curves, last 60 trading days. │
│  Today's in gold. Source: Bank of England."                               │
└──────────────────────────────────────────────────────────────────────────┘
```

- The curve field is the signature moment. Full spec in `05-signature-moments.md`.
- Headline and subline copy are in `04-content.md`. Left aligned, max 14 words in the headline.
- (1 November 2026) The third card is no longer a "650+" stat card. Rows and cards of bare numbers are an AI tell. Redesign it in Phase 5 as something with substance, for example the latest Stirling edition (number, date and headline from its open data).
- The three floating cards overlap one another slightly and sit at different depths (two glass, one night). They link to the essay, the Ledger and the Zaltek experience respectively.
- On mobile: headline and buttons first, then the cards stacked in a single overlapping cluster beneath, the curve field behind everything at lower opacity.

### 2. Proof strip (removed)

Removed on 1 November 2026: a row of facts reads as an AI-generated stat strip. The facts it held now live where they explain themselves: the Year 1 result in the education card, the council template in the Zaltek role, the projects in the projects band, Raymond James in experience.

### 3. Writing

```
┌───────────────────────────────────────────┐ ┌──────────────────────┐
│  [chart panel, overlapping the card top]  │ │  Essay No. 2         │
│   real chart from the essay, glass chip   │ │  (or "Next essay in  │
│   with the key figure                     │ │   progress" state)   │
├───────────────────────────────────────────┤ ├──────────────────────┤
│  No. 1, 3 November 2026, 6 min read        │ │  Essay No. 3         │
│  Title (h3 large)                          │ │                      │
│  Summary                                   │ └──────────────────────┘
│  Read the essay                            │   All essays
└───────────────────────────────────────────┘
```

- Section heading plus one line: every essay ends with a dated prediction, tracked on the Ledger.
- The newest essay is the large card. Older essays (when they exist) fill the right column. With only one essay, the right column shows a single understated "Next essay in progress" panel, not fake placeholders.

### 4. Projects (the dark band)

```
 ████████████████████████████████████████████████████████████████████████
 █  Section heading (night-text) + one line                [All][Markets][Data][Systems] █
 █  ┌───────────────────────────────┐ ┌───────────────┐                  █
 █  │ large feature card            │ │ standard card │                  █
 █  │ live miniature graphic        │ │ graphic       │                  █
 █  │ from the project's own data   │ │               │                  █
 █  │ title, one line, key result,  │ └───────────────┘                  █
 █  │ status, stack                 │ ┌───────────────┐                  █
 █  └───────────────────────────────┘ │ standard card │                  █
 █  ┌───────────────┐ ┌───────────────────────────────┐                  █
 █  │ standard card │ │ large feature card            │                  █
 █  └───────────────┘ └───────────────────────────────┘                  █
 █  View all projects                                                    █
 ████████████████████████████████████████████████████████████████████████
```

- A bento grid with two card sizes and deliberately different anatomies (graphic on top for some, graphic on the right for the wide ones). Not identical tiles.
- Every card graphic is drawn from the project's real output. Specs in `05-signature-moments.md`.
- Filter tabs reflow the grid with a layout animation. Each card links to its case study.
- Order and grouping are in `04-content.md`.

### 5. The Ledger (removed)

> **Removed 2 November 2026 at Padraig's request.** No Ledger section, no `/ledger` page, no nav link. Essays still end with a dated prediction, shown as a card in the essay; nothing tracks or resolves it.


Split layout: on the left, heading and two sentences explaining the idea; on the right, a raised card listing predictions with an Open / Resolved toggle, a progress bar for each open prediction (made date to check date), and the running record written as one sentence (for example "One prediction made, none resolved yet."), never as a row of numbers. Links to `/ledger`.

### 6. Experience and education

Left: a vertical list of roles (organisation, role, dates) as tabs. Right: a detail panel for the selected role with two to four plain bullets. Below or beside: a compact education card (Queen Mary, course, Year 1 average, standout modules). Link: "Download CV".

### 7. Contact

> **Planned 1 November 2026:** the "torch" (`components/Torch.tsx`, prototype at `/lab/heroes/torch`) lives here, if it earns its place. The latest essay's text sits nearly invisible behind the panel, and a soft light following the cursor reveals it; on touch devices the light drifts. It should be a quiet discovery, not a feature. Drop it if it competes with the email link.


A large night panel (16px radius) with a faint echo of the curve field, a short line inviting contact, the email address as a large link, and buttons for LinkedIn, GitHub and the CV.

### 8. Footer

Small print: copyright, location (London and Newcastle), RSS, and Padraig's own `built-by` badge (github.com/poggey/built-by) as a personal touch.

## Essay page `/writing/[slug]`

```
nav (with reading progress bar and "x min left" on desktop)

          centred header: No. 1, tags as chips
          Title (title)
          Standfirst (essay-dek, Source Serif)
          Padraig Middleton, 3 November 2026, 6 min read   [Copy link] [Share on LinkedIn]

   ┌ reading column 680px ───────────────┐  ┌ sidenotes 240px ┐
   │ body (Source Serif 4, 20/1.75)       │  │ 1. source…      │
   │ drop cap on first paragraph          │  │ 2. source…      │
   │ pull quote                           │  └─────────────────┘
   └──────────────────────────────────────┘
   ┌ figure, up to 960px ─────────────────────────────┐
   │ chart, title, source caption                      │
   └───────────────────────────────────────────────────┘
   ┌ interactive figure (night card) ─────────────────┐
   │ e.g. the headroom slider                          │
   └───────────────────────────────────────────────────┘
   Where I could be wrong (raised card)
   Prediction card (night, gold dot, the essay's own prediction paragraph, made and check dates, how it will be judged; no tracking since the Ledger was removed)
   Sources (numbered, linked)
   Author card: one line about Padraig, links to About and CV
   Next / previous essay
```

- MDX components available inside essays: `<Figure>`, `<Chart>`, `<PullQuote>`, `<WhereIMightBeWrong>`, `<Prediction id="…" />`, and one-off interactives (for example `<HeadroomSlider />`).
- Markdown footnotes (`[^name]`) become sidenotes on wide screens and tap-to-open notes on mobile.
- Each essay gets a generated Open Graph image (title, number, key figure, a slice of the curve field) so LinkedIn previews look designed.

## Project case study `/projects/[slug]`

Template sections, in order: header (title, one line, status, year, links to live site and GitHub), the question, the headline result (one or two key figures with explanation), the main graphic (larger version of the card graphic), method (short), what broke or the limitations, stack, what I would do next. Content for each is in `04-content.md`.

## The Ledger page `/ledger`

Running record at the top (made, right, wrong, open; hit rate shown only once at least three have resolved). Then every prediction as a row: number, claim, date made, check date, status, a link to the essay, and for resolved ones the outcome and evidence link. Filter: all, open, resolved. Short note at the bottom: how predictions are judged (the claim as written, checked on the date, no edits after publishing).

## About page `/about`

Longer bio (Padraig writes this), experience in full, education, skills, extracurriculars, CV download, contact. Optional headshot.

## Components

Build each as its own file in `components/`. Primitives first (Phase 1), then sections.

- Primitives: `Button`, `Chip`, `Tabs` (with sliding indicator), `Card` (variants by elevation and radius), `GlassPanel`, `Stat`, `ExternalLink`, `ProgressBar`, `Tooltip`
- Layout: `Nav`, `MobileMenu`, `Footer`, `Section`, `Container`, `ReadingProgress`, `CommandMenu` (stretch)
- Homepage: `HeroCurves` (WebGL), `HeroCards`, `EssayFeature`, `ProjectsBento`, `ProjectCard`, `ProjectGraphic` (one per project), `LedgerPreview`, `ExperienceTabs`, `EducationCard`, `ContactPanel`
- Essay: `EssayHeader`, `Sidenote`, `Figure`, `Chart`, `PullQuote`, `WhereIMightBeWrong`, `PredictionCard`, `Sources`, `ShareBar`, `AuthorCard`, `EssayNav`
- Essay interactives: `HeadroomSlider` (first essay), later others

## Content model

All content lives in `content/` and is validated at build time with zod. A build must fail loudly if a required field is missing.

```ts
// content/posts/*.mdx frontmatter
Post = {
  title: string
  number: number              // essay sequence, No. 1, No. 2 …
  date: string                // ISO, e.g. "2026-11-03"
  summary: string             // one or two sentences; used on cards, RSS and the LinkedIn preview
  tags: string[]
  keyFigures?: { figure: string; label: string }[]   // up to 3
  predictionId?: string       // links to content/predictions.json
  draft: boolean              // drafts are hidden in production
}

// content/predictions.json
Prediction = {
  id: string                  // "001"
  made: string                // ISO date
  claim: string               // exactly as published, never edited afterwards
  checkDate: string           // ISO date
  status: "open" | "right" | "wrong" | "void"
  essaySlug: string
  resolvedOn?: string
  outcome?: string            // one sentence on what actually happened
  evidenceUrl?: string
}

// content/projects/*.mdx frontmatter
Project = {
  title: string
  slug: string
  kind: string                // e.g. "Risk analytics"
  oneLine: string
  group: "markets" | "data" | "systems"
  status: "live" | "complete" | "in-progress"
  year: number
  stack: string[]
  links: { live?: string; repo: string }
  keyResult?: { figure: string; label: string }
  graphic: string             // key into components/ProjectGraphic
  size: "feature" | "standard"
  order: number
}

// content/experience.json and content/site.json hold roles, education, proof-strip facts and contact details.
```

Reading time is computed from word count (230 words per minute), not typed by hand.

## Data preparation

- `scripts/gilt-curves.*`: builds `public/data/gilt-curves.json` for the hero (spec in `05-signature-moments.md`). Runs at build time and on a daily Vercel cron or ISR revalidation.
- `scripts/project-graphics/*`: small scripts (Python is fine) that read each project's repo or data and write compact JSON into `public/data/projects/`. Keep each file under 30 KB.

## Technical requirements

- Static generation for everything except the hero data, which revalidates daily.
- `next/font` for fonts (no layout shift), `next/image` for any raster image.
- Metadata for every page: title, description, canonical URL, Open Graph and Twitter cards.
- Generated OG images via `next/og` for the homepage, each essay and each project.
- RSS (`/rss.xml`) with full essay summaries and links.
- Vercel Analytics (privacy-friendly, no cookie banner needed). Track essay views and outbound clicks to LinkedIn, GitHub and the CV.
- No cookies, no trackers, no third-party embeds that phone home.
