# padraigmiddleton.com

Padraig Middleton's personal site: essays on economics and markets, project case studies and the prediction Ledger. The full specification is in `build-kit/`; `CLAUDE.md` holds the working rules.

## Running it

Needs Node 20.9 or later.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command               | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run dev`         | Development server                                        |
| `npm run build`       | Production build (static pages)                           |
| `npm run start`       | Serve the production build                                |
| `npm run lint`        | ESLint                                                    |
| `npm run typecheck`   | Generates route types, then runs TypeScript               |
| `npm run format`      | Prettier over the codebase                                |
| `npm run screenshots` | Screenshots at 1440, 768 and 390 wide into `screenshots/` |

Screenshots start their own dev server on port 4310. Choose pages with `PAGES`, for example `PAGES="/,/lab" npm run screenshots`. The first time, install the browser with `npx playwright install chromium`.

## Where things live

| Folder        | Contents                                                    |
| ------------- | ----------------------------------------------------------- |
| `app/`        | Routes. `app/globals.css` holds every design token.         |
| `components/` | UI, one component per file                                  |
| `lib/`        | Data loading and utilities                                  |
| `content/`    | Essays and projects (MDX), predictions and site data (JSON) |
| `scripts/`    | Data preparation (gilt curves, project graphics)            |
| `public/`     | Static files, including `cv.pdf`                            |
| `build-kit/`  | The specification. Read, never shipped.                     |
| `Posts/`      | Padraig's original essay drafts                             |

`/lab` shows the design system in one place. It is not indexed.

## Design tokens

All colours, type sizes, radii, shadows, glass and motion values are defined once in `app/globals.css` and exposed as Tailwind utilities, for example `bg-paper`, `text-ink`, `text-display`, `rounded-card`, `shadow-e2`, `duration-(--dur-hover)` and `ease-out`. Tailwind's default palette, radii and shadows are switched off, so anything outside the design system fails to build into a class.
