"""
Stirling: the three most recent weekday editions (number, date, Story of the Day headline),
exactly as published. Weekend editions repeat Friday's market story, so they are skipped.
Reads data/editions/*.json from the stirling-report repo.
"""

import datetime as dt
import json
import sys
from pathlib import Path

repo = Path(sys.argv[1])
editions = []
for file in sorted((repo / "data/editions").glob("*.json"), reverse=True):
    edition = json.loads(file.read_text())
    if dt.date.fromisoformat(edition["date"]).weekday() >= 5:
        continue
    story = edition["story"]
    headline = " ".join(p for p in [story.get("headlinePlain"), story.get("headlineEm")] if p)
    editions.append({"number": edition["number"], "date": edition["date"], "headline": headline})
    if len(editions) == 3:
        break

out = {
    "source": "Stirling, data/editions (open dataset)",
    "url": "https://stirling-report.vercel.app",
    "editions": editions,
}
path = Path("public/data/projects/stirling.json")
path.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
print(f"Wrote {path} ({path.stat().st_size} bytes)")
for e in editions:
    print(f"  No. {e['number']}, {e['date']}: {e['headline']}")
