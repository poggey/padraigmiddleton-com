# 02: Design system

Working name for the look: **Gilt-edged**. A cool, precise, light site with one deep navy band, a single blue for interaction and a single gold for "the thing that matters" (today's curve, an open prediction, a key figure). The name is a nod to gilt-edged securities, which is also the subject of the first essay.

Everything here is a rule, not a suggestion. If something needs to break a rule, write down why in `NOTES.md` and tell Padraig.

## Principles

1. **One signature, everything else quiet.** The hero's live gilt-curve field is the memorable thing. Every other element is disciplined: aligned, well spaced, restrained.
2. **Depth, not decoration.** Things feel designed because surfaces sit at different heights, overlap, and respond to the cursor. Not because of gradients or ornaments.
3. **Real data is the illustration.** Graphics come from Padraig's own projects and from real economic data. No stock imagery, no abstract blobs.
4. **Motion answers the visitor.** One orchestrated moment on load. After that, things move because the visitor did something (hovered, clicked, filtered, scrolled into a chart).
5. **Reading comes first.** On essay pages the design steps back. Typography and figures do the work.

## Colour

Define these as CSS variables in `app/globals.css` and as Tailwind theme tokens. Never use raw hex values in components.

| Token | Hex | Use |
|---|---|---|
| `--porcelain` | `#F3F5F8` | Page ground. Cool, not cream. |
| `--paper` | `#FFFFFF` | Cards and raised surfaces |
| `--ink` | `#14213A` | Primary text, headlines, primary buttons. A deep Treasury navy, never pure or tinted black. |
| `--slate` | `#4A5568` | Secondary text on light grounds |
| `--muted` | `#5F6878` | Meta text (dates, reading time). Must stay at 4.5:1 or better on `--paper` and `--porcelain`; check it. |
| `--line` | `#DDE2EA` | Hairlines and card borders |
| `--line-strong` | `#C3CAD6` | Dividers that need to be seen, inputs |
| `--night` | `#0B1424` | The one dark band (projects section) and the footer panel |
| `--night-raised` | `#14203A` | Cards on `--night` |
| `--night-text` | `#E8ECF4` | Primary text on `--night` |
| `--night-muted` | `#A6B0C3` | Secondary text on `--night` |
| `--signal` | `#2D5BE3` | Links, focus rings, interactive highlights, the primary data series on light |
| `--signal-soft` | `#8FA8FF` | The primary data series and links on `--night` |
| `--gilt` | `#C9A227` | Fills and lines only: today's curve, the open-prediction dot, highlighted bars. Never small text on light. |
| `--gilt-deep` | `#7A5D0A` | Gilt-coloured text on light grounds (passes AA) |

Rules:
- Blue means "you can interact with this" or "the main series". Gold means "this is the point". Never use both for the same job.
- Charts never rely on red versus green. Use blue versus gold, plus a difference in lightness.
- Gradients only as light: a soft radial glow of `--signal` at no more than 18% opacity behind the dark band, and the transparency fade in the hero. No gradient washes as decoration.
- Check every text and background pairing for WCAG AA (4.5:1 for body, 3:1 for 24px and up).

## Typography

Two families, clearly distinct, loaded with `next/font/google`:

- **Schibsted Grotesk** (variable): headlines, UI, navigation, labels, numbers in the interface. A grotesk designed for a news publisher, so it is editorial and precise without being a default choice.
- **Source Serif 4** (variable, with optical sizes): essay body text, essay standfirsts, pull quotes and figure titles inside essays. Long-form reading only.

Turn on tabular figures (`font-variant-numeric: tabular-nums`) anywhere numbers line up: stats, tables, the Ledger, chart labels. Check that Schibsted Grotesk supports it; if it does not, tell Padraig before choosing an alternative.

### Type scale (desktop / mobile)

| Token | Size / line height | Weight | Tracking | Use |
|---|---|---|---|---|
| `display` | 88 / 0.96 (48 / 1.0) | 600 | -0.035em | Homepage hero headline only |
| `title` | 64 / 1.0 (40 / 1.05) | 600 | -0.03em | Essay titles |
| `h2` | 44 / 1.05 (32 / 1.1) | 600 | -0.025em | Section headings |
| `h3` | 26 / 1.2 (22 / 1.25) | 600 | -0.015em | Card titles |
| `lead` | 21 / 1.5 (18 / 1.5) | 400 | -0.005em | Hero subline, section intros |
| `ui` | 16 / 1.5 | 400–500 | 0 | Body UI text, buttons |
| `small` | 14 / 1.45 | 500 | 0 | Labels, meta, captions |
| `stat` | 56 / 1.0 (40 / 1.0) | 600 | -0.04em | The few big numbers |
| `essay-body` | 20 / 1.75 (18 / 1.7) | 400 | 0 | Source Serif 4, max 68 characters per line |
| `essay-dek` | 24 / 1.45 | 400 | 0 | Source Serif 4 standfirst |
| `pull` | 32 / 1.3 | 400 italic | -0.01em | Source Serif 4 pull quote |

Rules:
- Sentence case everywhere. No all-caps labels, no letter-spaced eyebrows.
- Emphasis in headlines comes from the words, size and weight. Do **not** set one word or phrase in italic or a different colour (this is the most common "AI-generated" tell, and the previous drafts did it).
- Line length: under 75 characters for UI text, under 68 for essay body.
- Use real typographic characters: curly quotes and apostrophes, en dashes for ranges (2019–20), proper minus signs (−) in figures, non-breaking spaces between numbers and units where needed.

## Layout

- Base unit 4px. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Page container: 1200px max content width, 32px side padding (20px on mobile).
- Essay reading column: 680px, with a 240px sidenote column to its right on wide screens (sidenotes collapse into tap-to-open notes on mobile). Figures may break out to 960px.
- Section rhythm: 128px vertical padding on desktop, 80px on mobile. One idea per section.
- Alignment: left-aligned throughout, except the essay header, which is centred.
- Breakpoints: 390 (phone), 768 (tablet), 1024 (small laptop), 1440 (desktop). Test all four.

## Shape: radii by hierarchy

Different jobs get different radii, so the page does not look like a kit of identical cards. Keep surfaces crisp: heavy rounding on cards reads as amateur. (Changed 1 November 2026 at Padraig's request; was 12 / 20 / 28 / 36.)

| Radius | Use |
|---|---|
| 999px | Buttons, chips, tabs, toggles |
| 4px | Inputs, tooltips, small inline panels, sidenote cards, graphics inside cards |
| 8px | Standard cards (essay previews, experience panel) |
| 12px | Feature cards (the large project tiles) |
| 16px | Section-scale panels (footer contact panel) |

## Depth

Shadows are tinted with `--ink`, never neutral grey. Four levels:

| Level | Recipe | Use |
|---|---|---|
| `e0` | `0 0 0 1px var(--line)` | Flat surfaces on the ground |
| `e1` | `0 1px 2px rgb(20 33 58 / 0.05), 0 0 0 1px rgb(20 33 58 / 0.06)` | Resting cards |
| `e2` | `0 14px 32px -14px rgb(20 33 58 / 0.22), 0 0 0 1px rgb(20 33 58 / 0.07)` | Hovered or raised cards |
| `e3` | `0 32px 64px -24px rgb(20 33 58 / 0.38), inset 0 1px 0 rgb(255 255 255 / 0.7)` | Floating elements: hero cards, menus, the command palette |

Layering rules: in the hero and the writing section, at least two surfaces should overlap so the page reads as layered. Overlaps must never hide content or break at mobile widths.

## Glass

Used in exactly four places: the navigation bar, the floating cards in the hero, chips laid over graphics, and the command menu.

```css
background: rgb(255 255 255 / 0.62);
backdrop-filter: blur(20px) saturate(170%);
-webkit-backdrop-filter: blur(20px) saturate(170%);
border: 1px solid rgb(255 255 255 / 0.7);
box-shadow: var(--e3);
```

The nav starts fully transparent over the hero and gains the glass background and a bottom hairline after 8px of scroll (200ms transition). Fallback where `backdrop-filter` is unsupported: `rgb(255 255 255 / 0.94)`.

## Motion

### Tokens

| Token | Value | Use |
|---|---|---|
| `--dur-press` | 120ms | Button press feedback |
| `--dur-hover` | 200ms | Hover states |
| `--dur-ui` | 320ms | Tabs, toggles, filters, menus |
| `--dur-reveal` | 600ms | Data graphics drawing in |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, hover |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Things moving from A to B |
| Spring | stiffness 380, damping 36 | Motion layout animations (filter reflow, tab indicator) |

### The one orchestrated moment: homepage load

1. 0–300ms: headline, subline and buttons are already readable (never wait on animation to read).
2. 0–1800ms: the gilt curves draw in from left to right, oldest first, staggered; today's curve draws last in gold.
3. 600–1400ms: the three floating hero cards settle into place (fade plus 16px rise, staggered 120ms).
4. After that, nothing moves on its own except the very slow drift of the curve field (and that stops under reduced motion).

### Motion that responds to the visitor (allowed)

- Hero: curves bend gently away from the cursor; floating cards tilt up to 4 degrees towards the cursor.
- Project cards: a soft spotlight follows the cursor across the card border and surface; the card rises to `e2`.
- Project graphics: each card's data draws in once, when 40% of it is visible. This shows the data, so it earns the motion.
- Filters, tabs and toggles: a shared sliding indicator; content reflows with a Motion layout animation.
- Buttons: 1px lift on hover, scale 0.98 on press.
- Essays: reading progress bar in the nav; sidenote highlights its reference on hover; interactive figures respond instantly.
- Page transitions: the View Transitions API cross-fade (200ms), with the essay card morphing into the essay header if it can be done cleanly.

### Not allowed

- Fade-and-slide-up on every section as you scroll. This is the most generic effect on the web.
- Count-up animations on numbers.
- Scroll-jacking, pinned sections that trap the scroll, parallax on text.
- Cursor trails, custom cursors, magnetic buttons.
- Anything looping in peripheral vision except the slow curve drift.

### Reduced motion

Under `prefers-reduced-motion: reduce`: curves render in their final state with no drift and no cursor response, Lenis is off, graphics appear without drawing, transitions become instant or a 120ms opacity fade at most. Test this explicitly.

## Interaction inventory

| Element | Behaviour |
|---|---|
| Navigation | Transparent over the hero, glass after scroll. Current section underlined. On mobile: a menu button opens a glass sheet. |
| Command menu (stretch goal) | ⌘K or Ctrl+K opens a glass palette to jump to any essay, project or page. Hinted subtly in the nav on desktop only. |
| Hero | Cursor-reactive curve field, tilting cards, hover on the gold curve reveals its date and 10-year yield. |
| Essay cards | Lift to `e2`; the key figure chip becomes fully opaque. |
| Project cards | Spotlight hover, graphic draws in on view, filter tabs reflow the grid. |
| Ledger | Open / resolved toggle; each prediction shows a progress bar from made-date to check-date. |
| Experience | Role list on the left, detail panel on the right; the panel cross-fades and the active indicator slides. |
| Copy link | Button label changes to "Copied" for 2 seconds. |
| Footnotes | Sidenotes on desktop, tap-to-open popovers on mobile. |

## Iconography and imagery

- Icons: a single stroke icon set (Lucide), 1.5px stroke, used rarely. No emoji.
- External links get a small ↗ after the label. Internal links get no arrow; the whole card or the text is the link.
- No stock photography. If Padraig adds a headshot, show it once, on the About page, in natural colour with a 20px radius.
- Abstract textures (for example from the Higgsfield tool) only if they genuinely add something, and only behind content, never as the content.

## Chart style (for every data graphic)

- Primary series `--signal` (or `--signal-soft` on night), highlight `--gilt`, everything else `--line-strong`.
- Lines 2px, bars with 6px top radius, no 3D, no drop shadows.
- Label directly on the chart, not in a legend. Axis labels in `small`, tabular figures.
- Every chart has a one-line source caption underneath: "Source: OBR, Economic and fiscal outlook, October 2026."
- Every chart has an accessible name (`role="img"` and `aria-label` summarising the takeaway) or an equivalent data table.

## The "AI-generated" tells to avoid

Check every page against this list before showing Padraig. These are what made the earlier drafts feel templated.

1. A warm cream background with a serif display and a terracotta accent.
2. A near-black background with one acid-green or neon accent.
3. Broadsheet pastiche: hairline rules everywhere, zero radius, dense columns.
4. The SaaS card kit: everything chopped into identical rounded cards with the same radius and the same grey shadow, plus gradient washes.
5. Template chrome: tracked all-caps eyebrows above every heading, meta strings joined with middle dots ("A · B · C"), labels with spaced em dashes, monospace for small data labels, an arrow on every link.
6. One word in a headline set in italic or a different colour.
7. Numbered section markers (01, 02, 03) when the content is not a sequence. (Essay numbers are a real sequence, so "No. 1" is fine.)
8. Fade-up on every section.
9. A hero that is "big number, small label, gradient".
10. A row of stats: three or four big numbers with small labels side by side, anywhere on the site, including "proof strips" written as a row of facts. Numbers belong inside a sentence, a chart or a single card that explains them. (Added 1 November 2026 at Padraig's request.)
11. Heavy rounding on cards and panels (16px or more on a standard card). (Added 1 November 2026.)
12. Blurred gradient blobs or mesh-gradient backgrounds with no meaning. Colour and movement must come from real data.

Before showing any page, do Chanel's test: look at it and remove one accessory.
