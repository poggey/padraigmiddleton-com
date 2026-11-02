"""
The Slate: distribution of returns (ROI) across the core sample of 58 films, with the five films
that earned about 65% of all the profit marked. Reads data/processed/films_financial.csv.
"""

import json
import sys
from pathlib import Path

import pandas as pd

repo = Path(sys.argv[1])
films = pd.read_csv(repo / "data/processed/films_financial.csv")
core = films[films["in_core"].astype(str).str.lower().isin(["true", "1", "1.0"])]

# Bins of ROI in percent. Losses are capped at -100%; the long tail goes into one open bin.
edges = [-100, -75, -50, -25, 0, 50, 100, 200, 400, 800, None]
labels = ["−100%", "−75%", "−50%", "−25%", "0", "+50%", "+100%", "+200%", "+400%", "+800%"]
top = core.nlargest(5, "profit_usd")

bins = []
for i, low in enumerate(edges[:-1]):
    high = edges[i + 1]
    roi = core["roi"] * 100
    inside = (roi >= low) & (roi < high if high is not None else True)
    if i == 0:
        inside = roi < (high or 0)
    titles = core[inside]["title"].tolist()
    bins.append(
        {
            "from": labels[i],
            "count": int(inside.sum()),
            "top": sorted(set(titles) & set(top["title"])),
        }
    )

assert sum(b["count"] for b in bins) == len(core) == 58, "every core film in exactly one bin"
out = {
    "source": "The Slate, data/processed/films_financial.csv (core sample)",
    "films": len(core),
    "medianRoi": round(float(core["roi"].median()) * 100),
    "meanRoi": round(float(core["roi"].mean()) * 100),
    "topFive": top["title"].tolist(),
    "bins": bins,
}
path = Path("public/data/projects/the-slate.json")
path.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
print(f"Wrote {path} ({path.stat().st_size} bytes)")
for b in bins:
    print(f"  {b['from']:>6}  {'#' * b['count']}  {b['top']}")
