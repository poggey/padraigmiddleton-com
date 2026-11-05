# padraigmiddleton.com

Padraig Middleton's personal site: essays on economics and markets, and project case studies. The full specification is in `build-kit/`; `CLAUDE.md` holds the working rules.

## Running it

Needs Node 22 or later.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command               | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run dev`         | Development server                                        |
| `npm run build`       | Production build (static pages)                           |
| `npm run start`       | Serve the production build                                |
| `npm test`            | Unit tests (content loaders, schemas, MDX)                |
| `npm run lint`        | ESLint                                                    |
| `npm run typecheck`   | Generates route types, then runs TypeScript               |
| `npm run format`      | Prettier over the codebase                                |
| `npm run screenshots` | Screenshots at 1440, 768 and 390 wide into `screenshots/` |

Screenshots build the site and serve the production version on port 4310, so they work while `npm run dev` is running (Next.js allows one dev server per project). Choose pages with `PAGES`, for example `PAGES="/,/about" npm run screenshots`. The first time, install the browser with `npx playwright install chromium`.

## Where things live

| Folder        | Contents                                                   |
| ------------- | ---------------------------------------------------------- |
| `app/`        | Routes. `app/globals.css` holds every design token.        |
| `components/` | UI, one component per file                                 |
| `lib/`        | Data loading and utilities                                 |
| `content/`    | Essays and projects (MDX), site data and chart data (JSON) |
| `scripts/`    | Data preparation (gilt curves, project graphics)           |
| `public/`     | Static files, including `cv.pdf`                           |
| `build-kit/`  | The specification. Read, never shipped.                    |
| `drafts/`     | Padraig's original essay drafts, not published             |

## Design tokens

All colours, type sizes, radii, shadows, glass and motion values are defined once in `app/globals.css` and exposed as Tailwind utilities, for example `bg-paper`, `text-ink`, `text-display`, `rounded-card`, `shadow-e2`, `duration-(--dur-hover)` and `ease-out`. Tailwind's default palette, radii and shadows are switched off, so anything outside the design system fails to build into a class.

## Gilt curve data

`public/data/gilt-curves.json` holds the last 60 trading days of UK nominal gilt spot curves from the Bank of England, drawn by the hero ribbon. Refresh it with:

```bash
pip install -r scripts/requirements.txt   # once
python3 scripts/gilt_curves.py
```

The script merges the Bank's current-month file into the committed history and keeps the latest 60 days. It refuses to overwrite the file if the data looks wrong.

## Content

Everything on the site comes from `content/`, checked against the schemas in `lib/content/schemas.ts` when the site builds. A missing or malformed field fails the build with the file name and the field.

| File                      | What it holds                                          |
| ------------------------- | ------------------------------------------------------ |
| `content/posts/*.mdx`     | Essays. The file name is the URL.                      |
| `content/projects/*.mdx`  | Project case studies. `slug` must match the file name. |
| `content/experience.json` | Roles and education                                    |
| `content/site.json`       | Contact details, homepage copy, About, skills          |
| `content/charts/*.json`   | Data for essay charts                                  |

Footnotes (`[^id]` and `[^id]: source` on one line) become numbered sidenotes. Reading time is worked out at 230 words a minute. The RSS feed, sitemap and robots.txt are generated at build.
