# Project graphics

Each script reads one project's own repo or data and writes a small JSON file to
`public/data/projects/`, which a `ProjectGraphic` component draws. Clone the repo somewhere
outside this project and pass its path. Keep each output under 30 KB.

| Script                          | Repo                       | Needs                                          |
| ------------------------------- | -------------------------- | ---------------------------------------------- |
| `risk_dashboard.py <repo>`      | poggey/risk-dashboard      | `yfinance`, `pandas`, `numpy` (fetches prices) |
| `stirling.py <repo>`            | poggey/stirling-report     | nothing (reads `data/editions`)                |
| `the_slate.py <repo>`           | poggey/the-slate           | `pandas`                                       |
| `portfolio_optimiser.py <repo>` | poggey/portfolio-optimiser | `yfinance`, `pandas`, `numpy`, `scipy`         |
| `apex.py <repo>`                | poggey/f1-pace-analyser    | nothing (reads `analysis/apex.json`)           |

Run from this project's root, for example:

```bash
python3 scripts/project-graphics/the_slate.py ../the-slate
```
