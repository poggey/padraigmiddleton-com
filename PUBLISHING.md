# Publishing

How to publish an essay, add a chart, and update a project. Everything is files in
`content/`; pushing to `main` deploys.

## Publish an essay

1. Create `content/posts/<slug>.mdx`. The file name is the address: `the-bill-britain-keeps-signing.mdx`
   becomes `/writing/the-bill-britain-keeps-signing`. Use lowercase words and hyphens.
2. Start it with this frontmatter:

   ```yaml
   ---
   title: "The bill Britain keeps signing"
   number: 2 # the next essay number; two essays can't share one
   date: "2026-11-03" # the day it goes public, YYYY-MM-DD
   summary: "One or two sentences. Used as the standfirst, in previews and in the RSS feed."
   tags: ["UK economy", "Gilts"] # at least one; they become the filters on /writing
   keyFigures: # optional, up to three; the first appears on the homepage card and the LinkedIn image
     - figure: "£15bn"
       label: "added to this year’s debt interest before a single Budget measure was counted"
   draft: false # true keeps it off the live site but visible when running locally
   ---
   ```

3. Write the essay in Markdown underneath. Use curly quotes and apostrophes (’ “ ”) and en dashes
   in ranges (2027–28). Ranges never break across lines; the site handles that.
4. Sources are footnotes. Cite with `[^name]` straight after the punctuation, and put the source at
   the bottom on **one line**:

   ```md
   Linkers make up 25.2% of the portfolio.[^dmo]

   [^dmo]: UK Debt Management Office, [Debt Management Report 2026–27](https://…).
   ```

   They appear in the margin on wide screens, as a tap-to-open card on phones, and numbered under
   "Sources" at the end. A source that is never cited, or a citation with no source, stops the build.

5. Check it locally: `npm run dev -- --port 4000`, then open the essay.
6. Run `npm test` and `npm run build`. Both must pass; the build checks every essay and chart and names the file if something is wrong.
7. Commit and push to `main`. Vercel deploys it, and the essay appears on the homepage, on
   `/writing`, in the RSS feed and in the sitemap, with its own LinkedIn preview image.

## Components you can use in an essay

| Component                                                             | What it does                                                                                  |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `<Chart id="debt-interest-gdp" />`                                    | A line chart from `content/charts/<id>.json`, in the reading column, with its source beneath. |
| `<PullQuote>…</PullQuote>`                                            | One sentence, set large. At most one per essay.                                               |
| `<WhereIMightBeWrong>…</WhereIMightBeWrong>`                          | Sets the counter-argument apart on a raised card. Adds no heading.                            |
| `<Figure src="/images/…" alt="…" width={…} height={…} caption="…" />` | An image, the width of the reading column.                                                    |

`<HeadroomSlider />` belongs to essay No. 1. A new interactive needs a new component.

## Add a chart

Create `content/charts/<id>.json` with `title`, `subtitle` (optional), `source`, `caption` (the one
line on the homepage card), `summary` (the takeaway in a sentence, read by screen readers), `unit`,
`firstForecast` (optional, the first forecast year) and `points` (`{ "year": "2019–20", "value": 1.72 }`).
Then use `<Chart id="<id>" />` in the essay.

## Update a project

Each project is `content/projects/<slug>.mdx`: the frontmatter holds the card (title, one line,
status, stack, links, key result), and the Markdown below it is the case study. The data behind each
graphic comes from the export scripts in `scripts/project-graphics/` (see the README there).

## Things that update themselves

- **Gilt curves** in the hero: a GitHub Action refreshes them from the Bank of England every weekday
  and commits the result, which redeploys the site.
- **Homepage**: always shows the newest essay (highest `number`).
