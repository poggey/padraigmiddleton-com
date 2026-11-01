"""
Builds public/data/gilt-surface.json: weekly UK nominal gilt spot curves since January 2025,
for the hero's yield-curve surface (maturity across, time going back, yield as height).

Uses the same Bank of England files and parsing as gilt_curves.py: the yearly archive
("2025 to present") plus the current month. Every fifth trading day is kept, ending on the
latest close, so the surface is about 90 curves deep.

Run from the project root:  python3 scripts/gilt_surface.py
"""

import json
import sys
from pathlib import Path

from gilt_curves import ARCHIVE, LATEST, MATURITIES, book, download, read_spot_curves

OUT = Path("public/data/gilt-surface.json")
STEP = 5  # trading days between curves


def main() -> int:
    history = read_spot_curves(book(download(ARCHIVE), "2025 to present"))
    history.update(read_spot_curves(book(download(LATEST), "GLC Nominal daily data current month")))

    dates = sorted(history)
    weekly = dates[::-1][::STEP][::-1]  # count back from the latest close
    yields = [y for d in weekly for y in history[d]]
    if len(weekly) < 40 or not all(0 < y < 15 for y in yields):
        print(f"Refusing to write: {len(weekly)} curves")
        return 1

    OUT.write_text(
        json.dumps(
            {
                "asOf": weekly[-1],
                "source": "Bank of England",
                "description": "UK nominal gilt spot curves, every fifth trading day",
                "maturities": MATURITIES,
                "curves": [{"date": d, "yields": [round(y, 2) for y in history[d]]} for d in weekly],
            },
            separators=(",", ":"),
        )
        + "\n"
    )
    print(f"Wrote {len(weekly)} curves, {weekly[0]} to {weekly[-1]}, {OUT.stat().st_size} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
