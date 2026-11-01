# 07: Quality bar (definition of done)

Check the relevant items at the end of every phase, and every item in Phase 10. Report each as pass, fixed, or not applicable.

## Content and honesty

- [ ] Every fact, number and claim traces to `04-content.md`, an MDX file, or Padraig in the chat.
- [ ] No invented data in any chart. Illustrative graphics are labelled as illustrative.
- [ ] No confidential work details, no phone number, no home address.
- [ ] No visible `TODO(Padraig)` on a public page at launch.
- [ ] Essay wording unchanged from what Padraig wrote.
- [ ] Every chart has a source line.

## Writing

- [ ] British English throughout.
- [ ] No em dashes anywhere in the interface or Claude-written copy.
- [ ] Sentence case for headings, buttons and labels. No all-caps labels.
- [ ] Buttons say what happens ("Download CV", not "Learn more").
- [ ] No generic phrases (passionate, leverage, seamless, unlock, delve, robust).
- [ ] Curly quotes and apostrophes, en dashes for ranges, minus signs in figures.

## Visual design

- [ ] Every colour, radius, shadow and duration comes from a token.
- [ ] Radii follow the hierarchy table; not everything shares one radius.
- [ ] Shadows are tinted navy, at the defined elevation levels only.
- [ ] Glass appears only in the four permitted places.
- [ ] At least two overlapping layers in the hero and the writing section, and they hold up at 390px.
- [ ] None of the nine "AI tells" in `02-design-system.md` appear.
- [ ] Alignment: left edges line up across sections; nothing is off the grid by a few pixels.
- [ ] Headlines have a good rag: no single-word last lines (use `text-wrap: balance` for headings, `pretty` for paragraphs).
- [ ] Each page passes the "remove one accessory" test.

## Motion

- [ ] Only one orchestrated sequence (homepage load). No fade-up on every section.
- [ ] Every other animation answers a visitor action or reveals data.
- [ ] Durations and easing come from the motion tokens.
- [ ] `prefers-reduced-motion` tested: no drift, no draw-in, no Lenis, no spotlight, instant or very short fades.
- [ ] No layout shift caused by animation.
- [ ] Render loops pause when off screen or when the tab is hidden.

## Responsiveness

- [ ] Screenshots reviewed at 390, 768, 1024 and 1440 wide.
- [ ] No horizontal scrolling at any width (wide tables and charts scroll inside their own container).
- [ ] Touch targets at least 44 × 44px.
- [ ] Hover-only effects have a sensible touch equivalent or are simply absent on touch.
- [ ] The mobile menu works, traps focus, and closes on Esc and on navigation.

## Accessibility (WCAG 2.2 AA)

- [ ] Text contrast at least 4.5:1 (3:1 for 24px and above), including text over the curve field and over glass.
- [ ] Every interactive element is a real `<a>` or `<button>`, reachable by Tab in a sensible order, with a visible focus ring.
- [ ] Skip-to-content link.
- [ ] One `h1` per page, headings in order.
- [ ] Every chart and graphic has an accessible name; decorative ones are `aria-hidden`.
- [ ] The slider has a label and announces its value.
- [ ] Tabs use the correct ARIA roles and arrow-key behaviour.
- [ ] Colour is never the only way information is conveyed.
- [ ] Pages make sense with CSS turned off and with a screen reader (spot-check with VoiceOver).

## Performance

- [ ] Lighthouse 95+ for Performance, Accessibility, Best Practices and SEO, on mobile and desktop, for the homepage and an essay.
- [ ] Largest Contentful Paint under 2.0s on a mid-range phone profile; the LCP element is text, not the canvas.
- [ ] Cumulative Layout Shift under 0.05.
- [ ] Interaction to Next Paint under 200ms.
- [ ] Homepage JavaScript under 150 KB gzipped in total; the hero under 40 KB of that.
- [ ] Fonts self-hosted through `next/font`, subset, no layout shift on load.
- [ ] Project and hero data files under 30 KB each.

## SEO and sharing

- [ ] Unique title and description for every page.
- [ ] Canonical URLs.
- [ ] Open Graph images generated for the homepage, each essay and each project, and checked in LinkedIn's Post Inspector.
- [ ] RSS feed validates.
- [ ] Sitemap and robots.txt present; `/lab` excluded.

## Maintainability

- [ ] Publishing an essay is one MDX file plus a push. Tested end to end.
- [ ] `PUBLISHING.md` exists and is accurate.
- [ ] `NOTES.md` records design decisions and rejected ideas.
- [ ] Components are small and named clearly enough that Padraig can explain any of them in an interview.
- [ ] Tests pass for content loaders and schemas.
