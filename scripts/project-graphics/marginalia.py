"""
Marginalia: the recommender's shortlist for its test reader (the committed fixture in
tests/recommender/expected.json, "Comfort" setting): each book's predicted rating out of 5 with
its confidence band. This is the real algorithm's output on a synthetic reader, labelled as such.
Titles come from seed/calibration-deck.json.
"""

import json
import re
import sys
from pathlib import Path

repo = Path(sys.argv[1])
expected = json.loads((repo / "tests/recommender/expected.json").read_text())
deck = json.loads((repo / "seed/calibration-deck.json").read_text())["deck"]


def slug(title: str) -> str:
    return "seed-" + re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


titles = {slug(b["title"]): (b["title"], b["author"]) for b in deck}
comfort = next(stop for stop in expected if stop["stop"] == "Comfort")
books = []
for pick in sorted(comfort["shortlist"], key=lambda p: -p["rHat"]):
    title, author = titles[pick["id"]]
    books.append({"title": title, "author": author, "predicted": pick["rHat"], "band": pick["band"]})

out = {
    "source": "Marginalia, tests/recommender/expected.json (the recommender's test reader)",
    "reader": "test reader",
    "setting": "Comfort",
    "books": books,
}
path = Path("public/data/projects/marginalia.json")
path.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
print(f"Wrote {path} ({path.stat().st_size} bytes)")
for b in books:
    print(f"  {b['predicted']:.2f} ± {b['band']}  {b['title']}")
