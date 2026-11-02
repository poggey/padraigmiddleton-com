# Design propositions

A fresh start on the look of the site. The content stays the same: the essays, the projects, your
experience and education, the CV and contact. Everything else is open: colour, type, hero, layout,
graphics, motion.

The aim, in your words: it should feel like Stripe without having Stripe's elements. Your own site,
with its own ideas.

---

## 1. Is the current design too close to Stripe?

Honestly, yes, as a whole. Each piece is fine on its own, but together they read as "inspired by
Stripe":

- a dark navy hero with a flowing sheet of fine lines
- violet and periwinkle in that sheet
- guide lines at the edges of the column
- solid blue buttons with a chevron

Someone who knows Stripe would make the connection within seconds. Before launch, that's worth fixing.

What actually makes Stripe feel the way it does is not those elements but five habits:

1. **One material, used rarely.** Stripe has one signature surface (its gradient) and puts it in a
   handful of places. Everything else is white, grey and type.
2. **Real things as illustration.** Their pictures are pieces of their own product. Nothing is
   decoration for its own sake.
3. **A drawn grid.** Lines and alignment you can feel, so every element looks placed rather than
   dropped in.
4. **Two-tone writing.** A strong first sentence, then a quieter second one in the same paragraph.
5. **Small, exact, unhurried.** Type is modest, spacing is generous, motion answers you rather
   than performing.

Every proposition below keeps those habits and swaps out the elements.

---

## 2. What I took from Oversight Supply

I looked through all 58 sections and opened nine of them in full (Fold, Plan, Folio, Florilegium,
Signal and Soil, Transmission, 404 Receipt, Orbit, Joiner). The useful ideas, not to copy:

- **Plan** (the architect's site): a numbered index on the left drives one big object on the
  right, and a technical title block (scale, date, drawing number) sits in the corner. **The
  interface borrows the paperwork of the profession.** For you, that paperwork is term sheets,
  bond certificates, trade confirmations and central bank charts.
- **Fold:** the index of works "unfolds" as you scroll, with a thin progress line and a tiny
  status label (folded, unfolding, index). **Scroll as a physical action with a clear end.**
- **Florilegium:** big numerals ("05:40" and "21:15") joined by one hairline, images captioned like
  plates in a book. **Restraint: one rule, one number, lots of space.**
- **Signal and Soil / Transmission:** a picture made from text characters that scatters when you
  move through it. **The texture is made of content.**
- **404 Receipt:** the error page is a document from the site's world (a lost-property receipt
  listing the pages you probably meant). **A 404 with a sense of humour that still helps.**

The common thread is **one idea per section, carried all the way through**. That's what I've tried
to do below.

---

## 3. Five directions

Each is a complete look. They're deliberately different from each other. Pick one or two and
I'll build them as real prototype pages you can click through before we commit.

### A. Intaglio: the site as a banknote

**Idea:** finance has its own beautiful visual tradition, and it isn't silk ribbons. It's
the engraving on banknotes and bond certificates: guilloché rosettes, fine line borders, serial
numbers, security printing. That's yours to use; Stripe doesn't go near it.

- **Colour:** cool white paper `#F6F7F4`, engraving green `#0E3B2E`, intaglio blue `#1F3A6D`, and
  one metallic: old gold `#B08D3C`, used only for "today". No gradients at all.
- **Type:** a high-contrast serif for headlines (Source Serif 4 at its display size, already
  loaded), with Schibsted Grotesk for everything else.
- **Hero:** a large guilloché rosette (hundreds of fine looping lines, like the pattern behind the
  King on a banknote) drawn live from the gilt data. Each ring is one day's yield curve wrapped
  into a circle. It turns very slowly. Moving the cursor across it "lifts" the lines nearest the
  pointer, like light catching engraved metal. Your headline sits beside it, set like the
  denomination on a note.
- **Signature details:** every page has a serial number in the corner (essay No. 1 is
  "PM-0001-2026"). Section breaks are fine engraved borders. The CV button looks like a stamp.
- **Projects:** each project becomes a "certificate", a card with a fine guilloché border
  generated from that project's own numbers, so no two look alike. The graphic is replaced by the
  certificate's centre: the project's one key number, engraved large (13 decimal places, 0.76
  Sharpe), with what it means underneath. This fixes the "basic graphics" problem by not using
  charts on the cards at all.
- **Motion:** lines draw on like an engraving tool cutting them. Nothing else moves on its own.
- **Why it isn't Stripe:** light paper instead of dark gradient, closed engraved patterns instead
  of flowing silk, green and gold instead of violet and blue.
- **Risk:** it could tip into "fancy". It needs real restraint: one rosette, thin borders, and
  lots of white.

### B. Survey: rates as a landscape

**Idea:** the gilt yields over time and maturity form a surface, a landscape. Draw it the way the
Ordnance Survey draws hills: contour lines. Instead of a ribbon you get a map you can read.

- **Colour:** map white `#F7F8F6`, contour slate `#5E6B78`, deep water blue `#173B5C`, and gold
  `#C29A2E` for one contour: today's curve. A pale wash of blue fills the low ground (low yields)
  and fades out on the high ground.
- **Type:** Schibsted Grotesk throughout, with small labels set like map labels (spaced,
  sentence case, tiny), and tabular figures for "heights" (yields).
- **Hero:** a full-width contour map of the last ten years of gilt yields. Maturity runs left to
  right, time runs bottom to top, and every 0.25% is a contour line. Hovering shows a crosshair and
  reads the "spot height" (for example "10-year, March 2023: 3.48%"). The 2022 mini-budget shows up
  as a cliff, and you can see it at a glance. Your headline sits in the calm low ground.
- **Signature details:** a north arrow and a scale bar in the footer as a quiet joke ("Scale:
  1 cm = 0.5%"). Section dividers are single contour lines that wander slightly.
- **Projects:** each project gets a small "map tile" in the same contour style, drawn from its own
  data (the risk dashboard's drawdown becomes a valley, the optimiser's frontier a ridge). One
  visual language for all projects, so they finally look designed as a set.
- **Motion:** contours draw from low ground to high on load. On scroll the map tilts very slightly,
  as if laid on a table.
- **Why it isn't Stripe:** a light, cartographic picture with closed contours and a crosshair, not
  a silk sheet. It's also a real visualisation people can learn from.
- **Risk:** it needs ten years of curves (the Bank of England publishes them; the data script just
  needs a longer range).

### C. Trading day: a site that keeps market hours

**Idea:** the whole site follows the London trading day, in real time. Visit at 7am and it's
pre-open: pale, quiet. At midday it's bright and crisp. After the 4:30pm close it turns to dusk,
and at night it's dark. The design has a clock in it, which no portfolio does.

- **Colour:** four palettes on one scale, blended continuously between them:
  - pre-open: `#EEF1F5` with a slate ink
  - open: `#FFFFFF` with a deep navy ink
  - close: `#F3EDE6` with a warm grey
  - night: `#0D1117` with a cool white

  Accent: one signal blue all day, and gold only for "today's close".

- **Type:** Schibsted Grotesk, with one large tabular clock in the nav (for example "London 14:32,
  markets open"), the only live element.
- **Hero:** a horizon. A single thin line across the screen is today's yield curve, and the sky
  above it is the colour of the current hour. On a weekday the line redraws itself when the new
  curve arrives. Your headline sits in the sky. Simple, calm, and different on every visit.
- **Signature details:** essays show "best read with coffee" style timestamps (written at, read
  by others mostly at). The footer says how long until the market opens or closes.
- **Projects:** a ruled index like the one you have now, but each project's preview is a single
  real number set very large on its own, with a one-line caption, not a chart.
- **Motion:** the palette shift is so slow you never see it happen; you only notice the time of
  day when you come back.
- **Why it isn't Stripe:** there's no illustration at all in the usual sense. The time of day is
  the design.
- **Risk:** a recruiter at 9am sees the bright version only. The idea needs the hero line to be
  strong enough on its own.

### D. Folio: the site as a desk of documents

**Idea:** everything is a printed document you can pick up. Essays are typeset pamphlets,
projects are research notes clipped together, your CV is a sheet on the desk. Tactile and
physical, where Stripe is glossy and digital.

- **Colour:** cool grey desk `#E9ECEF`, paper white, ink `#16202E`, and a single annotation colour,
  marker blue `#2F5BE0`, used the way you'd underline in pen.
- **Type:** Source Serif 4 for document text, Schibsted Grotesk for labels.
- **Hero:** your latest essay's first page, lying slightly turned on the desk, with your headline
  beside it. The page lifts and flattens as the cursor approaches it (a soft paper shadow, no 3D
  library). Under it, the corner of the next document peeks out: a project note.
- **Signature details:** real-looking margin annotations on essays (your sidenotes become pencil
  notes in the margin, still typeset, not fake handwriting). A paperclip on project notes.
- **Projects:** each project is a two-page research note: question, answer, one figure, all set
  like a printed brief. The figures are redrawn in one consistent print style (black ink, one blue,
  hatching for areas), so they look like they belong to one publication.
- **Motion:** documents slide into place and settle with a tiny overshoot, only when you open
  something.
- **Why it isn't Stripe:** light, physical and paper-based, with no lines or gradients as
  decoration.
- **Risk:** it can look gimmicky if overdone. Only the hero and project notes should be "objects";
  everything else stays flat.

### E. Axis: the page is the chart

**Idea:** keep your current structure (it's working) but change what the lines mean. The guide
lines become the axes of a chart that the whole page sits on. They carry tick marks, the section
breaks are gridlines, and the hero curve is plotted on that same grid. It removes the Stripe
signals and keeps what you like.

- **Colour:** drop the violet entirely. Night `#0B1220`, a single cool white for lines, one blue
  for interaction, and gold for "today". On light sections: white with ink lines. Two-tone, very
  disciplined.
- **Type:** Schibsted Grotesk; numbers on the axes in small tabular figures.
- **Hero:** the gilt curves plotted properly, but beautifully. Fine grey strands for the last 60
  days, today's curve in gold and thicker, sitting on real axes that are the page's own guide lines:
  maturities (6m, 2y, 5y, 10y, 30y) as ticks along the bottom edge of the hero, yields up the
  left frame line. The ribbon becomes a chart without losing its elegance. On hover, a vertical
  crosshair runs down the whole page along the nearest maturity tick.
- **Signature details:** the guide lines continue all the way down with small ticks at every
  section, like a long chart axis, and the scroll position is marked on the frame as a gold tick
  (your reading progress, everywhere, not just on essays).
- **Projects:** each project gets a graphic in exactly this chart style (same axes, same strand
  weights, same gold), so they read as one family. I'd redraw all eight from scratch in this
  style rather than reuse the current ones.
- **Buttons:** square, outlined, no chevron; the primary one filled with ink rather than blue.
- **Motion:** the crosshair, the reading tick, and charts that draw left to right as if being
  plotted. Nothing else.
- **Why it isn't Stripe:** it's literal where Stripe is abstract. The lines mean something (axes,
  ticks, values) instead of being pure decoration.
- **Risk:** least risky; the closest to what's built.

---

## 4. Stylistic ideas you can mix into any direction

Design elements, movement and interactivity. Each is small on its own.

**Design elements**

- **Two-tone headlines** (a habit, not an element): "Economics and markets, argued in writing.
  _Tested in code._" with the second sentence in a quieter colour.
- **A colophon** at the very bottom of the site: the typefaces, where the data comes from and when
  it was last updated, the build. A small sign of care that designers notice.
- **Serial numbers** on essays and projects ("No. 1" already exists; extend it so everything has a
  catalogue number).
- **A live market line in the nav:** the 10-year gilt yield and its move today, tiny and quiet,
  updated daily. It shows you live inside the subject.
- **A 404 as a "failed settlement" notice:** a trade confirmation that didn't settle, listing the
  pages you probably meant.

**Movement**

- **Plotted, not faded:** anything with data draws itself left to right, like a pen plotter, once,
  when it first appears.
- **Section breaks that are drawn:** a divider line draws across the page as you scroll past it,
  then stays still.
- **Settling numbers:** a figure (13 decimal places, 0.76) settles into place with a tiny
  vertical nudge. Not a count-up, which looks cheap.

**Interactivity**

- **A crosshair:** hovering any chart (hero included) shows a thin crosshair and the value under
  it, in the same style everywhere.
- **Lines that notice the cursor:** the page's guide lines brighten slightly near the cursor, like
  light along a wire. Very subtle.
- **An "explain" toggle on essays:** a small switch that highlights every number in the essay and
  shows its source on hover.
- **Keyboard shortcuts:** `/` to search essays and projects, `g` then `w` for writing. A small
  delight for technical readers and recruiters at engineering-heavy firms.

---

## 5. On the project graphics

You're right that they look basic. They are honest (each comes from the project's real output)
but they're nine different chart styles squeezed into small boxes. Whichever direction you pick,
the fix is the same:

- **One visual family** for every project, drawn in the direction's style (certificates, map
  tiles, plotted charts, or printed figures).
- **Fewer marks:** one idea per graphic, drawn large, with one gold mark for the thing that
  matters.
- **Or no chart at all:** a single number, set big and well, can be stronger than a small chart
  (directions A and C).

---

## 6. My recommendation

- **If you want the boldest, most "yours" site:** A (Intaglio). Nobody else in finance has a
  site that looks like a beautifully engraved note, and it gives every project a natural look
  (its certificate).
- **If you want the safest step from where we are:** E (Axis). It keeps the structure you like,
  removes the Stripe signals, and makes the lines mean something.
- **B (Survey)** is the most impressive piece of data work and would make a great hero, but it's
  the most effort.

Pick one or two (or mix, for example "E's structure with A's certificates for projects") and I'll
build working prototypes at full size, at three widths, so you can see them before deciding.
