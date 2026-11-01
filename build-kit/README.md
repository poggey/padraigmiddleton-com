# Build kit: padraigmiddleton.com

Everything Claude Code needs to design and build Padraig Middleton's personal website: what the site is for, who it is for, how it should look and move, every piece of content that goes on it, and a phase-by-phase build plan with prompts.

## How to use this kit

1. Create an empty project folder (for example `~/code/personal-site`) and open it in VS Code.
2. Copy the whole `build-kit/` folder into it.
3. Copy `build-kit/CLAUDE.md` to the project root, so Claude Code loads it automatically every session.
4. Add your reference screenshots to `build-kit/references/` (see `references/README.md`). This step matters: specific screenshots are the fastest way to get the finish you want.
5. Start Claude Code in the project folder and paste the **Phase 0** prompt from `docs/06-build-phases.md`.
6. Work through the phases in order. Each one ends with Claude Code showing you screenshots and stopping. Do not let it start the next phase until you are happy with the current one.

## What is in the kit

| File | What it is | Who reads it |
|---|---|---|
| `CLAUDE.md` | The constitution: goal, non-negotiables, stack, working rules. Goes in the project root. | Claude Code, every session |
| `docs/01-brief.md` | Who Padraig is, what the site must achieve, the audience, the references and what to take from each | Claude Code before any design work |
| `docs/02-design-system.md` | Colour, type, spacing, radii, depth, glass, motion and interaction rules, plus the "AI tells" to avoid | Claude Code for every visual decision |
| `docs/03-architecture.md` | Sitemap, page-by-page section specs with wireframes, components, content model, stack | Claude Code when building pages |
| `docs/04-content.md` | Every real fact, number, project, role and line of copy for the site. The single source of truth. | Claude Code whenever it writes copy |
| `docs/05-signature-moments.md` | Detailed specs for the few elements that make the site memorable (the gilt-curve hero, project graphics, essay interactives, the Ledger) | Claude Code in the relevant phases |
| `docs/06-build-phases.md` | Twelve phases (0 to 11), each with a paste-ready prompt, tasks, acceptance criteria and a stop point | You, to drive the build |
| `docs/07-quality-bar.md` | The definition of done: performance, accessibility, responsiveness, design critique checklist | Claude Code at the end of every phase |
| `content/posts/the-bill-britain-keeps-signing.mdx` | The first essay, ready to publish | The site |
| `content/predictions.json` | The prediction ledger data | The site |
| `references/README.md` | Which screenshots to collect and how to name them | You |

## The one-paragraph version

A personal site for an Economics and Finance student that a recruiter, a LinkedIn contact or a curious reader will remember. It leads with opinionated essays on economics and markets, backs them with projects that show the working, and keeps a public ledger of dated predictions. It should feel like a properly designed product site (think Stripe's layering, Apple's restraint, Supabase's graphics) rather than a well-formatted document, with one signature moment: a hero built from real UK gilt yield curves that responds to the cursor. Everything else stays quiet, precise and fast.

## Things only you can do

These are marked `TODO(Padraig)` throughout the kit. Collect them before or during the build:

- Buy the domain (suggested: `padraigmiddleton.com`).
- Write two or three sentences of your own for the About section (`docs/04-content.md`, About).
- Decide whether to include a headshot. If yes, add it to `public/`.
- Export a current CV as PDF for the download link.
- Resolve the Parkdean headcount (around 25 or around 30) so the site matches your CV.
- Confirm the status and one-line description of the FFT option pricing project before it goes on the site.
- Collect the reference screenshots.
