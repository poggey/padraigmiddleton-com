# CLAUDE.md: padraigmiddleton.com

You are building Padraig Middleton's personal website. This file is the constitution. It is loaded every session. The full specification lives in `build-kit/`; read the files listed below before doing anything in a new phase.

## Read order

1. `build-kit/docs/01-brief.md`: why the site exists and who it is for
2. `build-kit/docs/02-design-system.md`: every visual and motion rule
3. `build-kit/docs/03-architecture.md`: pages, sections, components, stack
4. `build-kit/docs/04-content.md`: all real content (the single source of truth)
5. `build-kit/docs/05-signature-moments.md`: the hero, project graphics, essay interactives, the Ledger
6. `build-kit/docs/06-build-phases.md`: the phase you are in
7. `build-kit/docs/07-quality-bar.md`: the definition of done
8. `build-kit/references/`: screenshots of what Padraig likes. Look at them.

## The goal in one sentence

A site that makes a recruiter or reader think "this person thinks clearly and builds things properly" within five seconds, and gives them a reason to come back.

## Non-negotiables

1. **Never invent content.** Every fact, number, date, quote, role, metric or claim must come from `docs/04-content.md` or from Padraig in the chat. If something is missing, insert a visible `TODO(Padraig): …` placeholder and list it in your phase summary. No lorem ipsum, no made-up stats, no fake testimonials, no fake logos.
2. **Never publish confidential work details.** Nothing from Raymond James beyond what `04-content.md` states (no client data, no internal model names, no Portfolio 360 results). Nothing private from Zaltek clients.
3. **Never publish Padraig's phone number or home address.** Contact is email, LinkedIn and GitHub only.
4. **One phase at a time.** Do the current phase, run the checks, show screenshots, write a short summary, then stop and wait. Never start the next phase without Padraig saying so.
5. **Look at your own work.** After every meaningful visual change, run the dev server and take screenshots at 1440px, 768px and 390px wide (Playwright or the browser tool). Compare against the design system and the references. Fix what is off before showing Padraig.
6. **Spend boldness in one place.** The gilt-curve hero is the signature. Everything else is quiet, precise and well spaced. If an effect does not earn its place, cut it.
7. **Respect reduced motion, keyboard users and screen readers** from the first component, not as a final pass.
8. **Performance is design.** The site must feel instant. Budgets are in `07-quality-bar.md`.

## Writing rules (for any copy you write or edit)

- British English (optimise, programme, centre, colour).
- No em dashes. Use commas, colons, full stops or brackets instead.
- No AI-sounding phrasing: no "delve", "leverage", "unlock", "seamless", "robust", "in today's fast-paced world", "passionate about", no rule-of-three filler.
- No defensive framing and no overexplaining. Short, plain sentences. Active voice.
- Sentence case for headings, buttons and labels. No all-caps labels.
- Buttons say exactly what happens: "Read the essay", "Download CV", "View on GitHub".
- Padraig's essays are his words. Do not rewrite them. You may fix typography (curly quotes, apostrophes) and markup only.

## Stack (decided; do not swap without asking)

- Next.js (App Router) with TypeScript, deployed on Vercel
- Tailwind CSS v4 with design tokens defined as CSS variables (see `02-design-system.md`)
- MDX for essays and project write-ups, validated with zod schemas
- Motion (the `motion` package, formerly Framer Motion) for interaction and layout animation
- GSAP with ScrollTrigger only where scroll-linked timing is genuinely needed
- Lenis for smooth scrolling, disabled under reduced motion
- Raw WebGL (or OGL if it keeps the code clearer) for the hero; no three.js unless Padraig agrees
- `next/og` for generated social images; RSS and sitemap generated at build
- Fonts via `next/font/google`: Schibsted Grotesk and Source Serif 4

Use the latest stable versions at install time and pin them in `package.json`. Before adding any other dependency, say why and ask.

## Code conventions

- `app/` for routes, `components/` for UI (one component per file), `lib/` for data loading and utilities, `content/` for MDX and JSON, `scripts/` for data preparation, `public/` for static assets.
- Design tokens live in one place (`app/globals.css`). Never hard-code a colour, radius, shadow or duration in a component.
- Server components by default. Client components only where interaction needs them.
- Every interactive element is a real `<button>` or `<a>`, keyboard reachable, with a visible focus ring.
- Keep components small and readable. Padraig needs to be able to explain any part of this code in an interview.

## Working rhythm

- Start each phase by restating its goal and listing what you will do. Ask questions if anything in the kit is ambiguous.
- Commit after each coherent step with a clear message.
- End each phase with: screenshots (three widths), what was built, what you checked from `07-quality-bar.md`, open `TODO(Padraig)` items, and anything you were unsure about.
- Keep a running `NOTES.md` of design decisions, rejected ideas and quirks, so later sessions do not repeat them.
