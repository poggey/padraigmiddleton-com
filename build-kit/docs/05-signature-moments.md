# 05: Signature moments

These are the few elements that make the site memorable. Build them with the most care. Everything else in the site supports them.

---

## 1. The gilt-curve hero

> **Updated 1 November 2026.** Built as a "ribbon": the 60 curves, with blended strands between days, drawn on a 2D canvas (approved instead of WebGL) on the night ground, newest and brightest at the front, latest close in gold, additive glow. It sweeps up the right-hand side and fades out behind the headline. No hero cards. Data: the Bank of England's full nominal spot curve, 6 months to 30 years (`scripts/gilt_curves.py`), not the three IADB par yields. See `NOTES.md` for every round of options.

### What it is

The homepage hero is filled, edge to edge, with UK government bond yield curves: one thin line per trading day for the last 60 trading days, layered from oldest (faint, furthest back) to today (gold, in front). The field drifts very slowly, bends gently away from the cursor, and draws itself in on first load. A small caption says exactly what it is and where the data comes from.

It works on three levels: it is beautiful as an abstract graphic, it is real data that changes every day, and it signals immediately that the person behind the site cares about markets. It also ties to Stirling, which already tracks the gilt curve.

### Data

1. First inspect `github.com/poggey/stirling-report`. Stirling already fetches gilt yields from the Bank of England for its Yield Curve Observatory, and mirrors each daily edition into its `/data` folder as an open dataset. Reuse the same source and series so the two projects agree. Report back what maturities are available before writing the script.
2. Write `scripts/gilt-curves.ts` (or Python) that produces `public/data/gilt-curves.json`:

```json
{
  "asOf": "2026-10-30",
  "source": "Bank of England",
  "description": "UK nominal gilt yields at selected maturities",
  "maturities": [2, 5, 10, 20, 30],
  "curves": [
    { "date": "2026-08-05", "yields": [3.91, 3.98, 4.31, 4.88, 5.02] }
  ]
}
```

(The numbers above are a format example only. Never ship them.)

3. Run it at build time, and revalidate daily (ISR or a Vercel cron after UK market close). Commit the latest snapshot so the site always has a fallback.
4. If the data cannot be fetched, use the last committed snapshot. If there is no real data at all, render an illustrative field and change the caption to "Illustrative yield curves". Never present invented data as real.

### Rendering

- A single `<canvas>` behind the hero content, full width and height, rendered with raw WebGL (or OGL if it keeps the code clearer). Cap the device pixel ratio at 2.
- X axis: maturity on a log scale (so the short end has room). Y axis: yield. If there are only a handful of maturities, draw a smooth curve through them with monotone cubic interpolation, and say so in the caption ("drawn through the 2, 5, 10, 20 and 30-year yields").
- Each day's curve is offset slightly up and to the right of the next, by date, so the stack reads as depth. Older curves are thinner and fainter (`--signal` at 8–35% opacity). Today's curve is 2.5px, `--gilt`, fully opaque, in front.
- The field extends off the right edge and fades to the page ground on the left, behind the headline, so text contrast is never compromised. Check contrast with the curves at their brightest.

### Motion

- Load: curves draw in from short maturity to long, oldest first, staggered over about 1.8 seconds. Today's gold curve draws last. Text is readable from the start.
- Idle: a very slow drift (a few pixels over 20 seconds). Barely noticeable.
- Cursor: points within about 160px of the cursor are pushed away with a smooth falloff and spring back when the cursor leaves. The effect is subtle, like a hand passing over water.
- Hover on the gold curve: a small glass tooltip shows the date and the 10-year yield, for example "30 Oct 2026, 10-year 4.xx%", from the data.
- Pause the render loop when the hero is off screen (IntersectionObserver) and when the tab is hidden.

### Fallbacks

- No WebGL: render the same data as a static SVG.
- Reduced motion: static final state, no drift, no cursor response, tooltip still works on hover and focus.
- Mobile: same field at lower density (every second curve), no cursor effect, gentle drift only.

### Caption (bottom left of the hero, `small`, `--muted`)

"UK gilt yield curves over the last 60 trading days. Today's in gold. Source: Bank of England."

### Budget

The hero's JavaScript (excluding React) should stay under 40 KB gzipped. It must not delay the Largest Contentful Paint, which should be the headline text.

---

## 2. Project graphics: miniature versions of the real thing

Every project card contains a small graphic made from that project's real output, like Stripe's cards that contain working miniature interfaces. Each is an SVG React component fed by a small JSON file in `public/data/projects/`, produced by a script in `scripts/project-graphics/`.

General rules:
- Real data only. If the data is not available yet, the card shows a clean title card instead, never a fake chart.
- Draw in once when the card is 40% visible (`--dur-reveal`), then stay still. Under reduced motion, render the final state.
- On the dark band: primary series `--signal-soft`, highlight `--gilt`, structure lines at 15–20% white.
- Each graphic has an `aria-label` describing what it shows.
- Each JSON file under 30 KB.

| Project | Graphic | Data source |
|---|---|---|
| Portfolio Risk Dashboard | Cumulative return line for one of the dashboard's preset portfolios (for example Multi-Asset, five years), maximum drawdown shaded in gold, a dashed line at the 95% one-day VaR level, labelled | Run the dashboard's `src/metrics.py` on the preset and export the series |
| Stirling | A stack of the three most recent editions as small cards; the front card shows the real edition number, date and Story of the Day headline | Stirling's open data in its repo `/data` |
| The Slate | Histogram of returns (revenue multiple or ROI) across the core sample; the bars containing the few films that made most of the profit in gold | `output/slate.json` in the repo |
| Portfolio Optimiser | Scatter of the 10,000 random portfolios (downsample to about 800 points), the efficient frontier line, the maximum-Sharpe portfolio as a gold point | Re-run the notebook and export |
| Escape Velocity | Share price since listing with the IPO price as a dashed line | Only once live data is in the repo (see `04-content.md`). Until then, a title card. |
| APEX | The teammate network: drivers as small nodes, links where two drivers shared a car-season, the largest connected component drawn with a force layout computed at build time (not live) | `apex.json` in the repo, or the networkx graph exported to JSON |
| Marginalia | A small 2D map of rated books (reduced from the 12-axis profiles) and one predicted book with its ± band | The recommender's test fixtures |

On the project case study pages, the same components render larger, with axis labels and a source caption.

### The card surface

- Card on `--night-raised` with a 1px border at 10% white, radius 28px (feature) or 20px (standard).
- Spotlight: a radial gradient (about 320px, `--signal` at 14%) follows the cursor across the card and brightens the border where the cursor is (use a CSS mask on a pseudo-element). Turn it off under reduced motion and on touch devices.
- Hover: the card lifts 2px. The graphic does not re-animate.

---

## 3. Essay interactives

Each essay can include one interactive figure that lets the reader test the argument. This is the habit that sets the writing apart. Keep each one small, honest about its assumptions, and accessible by keyboard.

### `<HeadroomSlider />` for "The bill Britain keeps signing"

- Purpose: show how quickly an inflation surprise uses up the fiscal headroom through index-linked gilts alone.
- Input: a slider labelled "Extra RPI and CPIH inflation, every year", from 0 to 3 percentage points in steps of 0.5. Default 1.
- Two horizontal bars on the same scale: "Fiscal headroom, 2029–30: £15bn" (fixed) and "Extra deficit from linkers alone: £{9 × points}bn" (updates instantly, turns gold once it exceeds the headroom).
- Result line: for 0, "No surprise: the buffer is untouched." Below 15, "Headroom left: about £{15 − cost}bn." At or above, "Headroom gone: about £{cost − 15}bn over."
- Caveat beneath, always visible: "Scaled linearly from the OBR's estimate that a one-point rise adds £9bn in 2029–30. An illustration, not a forecast."
- Accessible: native `<input type="range">` with a visible label and the current value announced (`aria-valuetext`).

### `<Chart>` for debt interest

Bar chart, £bn: 2019–20: 39, 2025–26: 109, 2026–27: 124 (highlighted), 2031–32 forecast: 160 (outlined, dashed). Title: "Debt interest has more than tripled since 2019". Source: OBR, Economic and fiscal outlook, October 2026. Bars grow in once when visible.

---

## 4. The Ledger

- Data: `content/predictions.json` (schema in `03-architecture.md`).
- Each open prediction shows a thin progress bar from the date made to the check date, filled to today, in `--gilt`, with "x days to go".
- Status chips: Open (gold dot, gently pulsing on the essay page only), Right (blue), Wrong (slate, with the outcome in one sentence), Void (muted, with a reason).
- The claim text is never edited after publication. Resolving a prediction means changing only `status`, `resolvedOn`, `outcome` and `evidenceUrl`.
- Hit rate appears only once three or more predictions have resolved.

---

## 5. Open Graph images (LinkedIn previews)

Most visitors arrive from LinkedIn, so the preview image is the first piece of design they see.

- Generated with `next/og` at 1200 × 630.
- Essay: night ground, a slice of the gilt curve field on the right in `--signal-soft` with today's curve in gold, essay number and title (Schibsted Grotesk 600, large), the first key figure as a glass chip, and "padraigmiddleton.com" small at the bottom.
- Project: same frame, project title and one line, the project's own graphic small on the right.
- Homepage: name, the headline, the curve slice.
- Test with LinkedIn's Post Inspector before launch.

---

## 6. Command menu (stretch goal, Phase 9 only if everything else is done)

- ⌘K or Ctrl+K opens a centred glass palette.
- Search across essays, projects and pages; arrow keys to move, Enter to open, Esc to close.
- A subtle "⌘K" hint in the nav on desktop only.
- Fully keyboard accessible with focus trapped while open.
