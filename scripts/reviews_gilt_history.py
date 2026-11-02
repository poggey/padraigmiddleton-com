"""
Builds public/data/reviews/gilt-history.json for the Survey design prototype on /reviews: one UK
nominal gilt spot curve per week (the last trading day of each week) for the last ten years,
1 to 30 years. (The older files often leave out the 6-month yield, so it starts at 1 year.)

Source: Bank of England yield curve data, the yearly archive plus the current month. Reuses the
reader from gilt_curves.py. Only needed for the prototype; the live site does not use it.

Run from the project root:  python3 scripts/reviews_gilt_history.py [path to glcnominalddata.zip]
"""

import datetime as dt
import json
import sys
import zipfile
from pathlib import Path

from gilt_curves import ARCHIVE, LATEST, MATURITIES, book, download, read_spot_curves

OUT = Path("public/data/reviews/gilt-history.json")
HISTORY_MATURITIES = MATURITIES[1:]
YEARS = 10


def main() -> int:
    archive = zipfile.ZipFile(sys.argv[1]) if len(sys.argv) > 1 else download(ARCHIVE)
    daily = {}
    for name in ("2016 to 2024", "2025 to present"):
        daily.update(read_spot_curves(book(archive, name), HISTORY_MATURITIES))
    latest = book(download(LATEST), "GLC Nominal daily data current month")
    daily.update(read_spot_curves(latest, HISTORY_MATURITIES))

    start = (dt.date.fromisoformat(max(daily)) - dt.timedelta(days=365 * YEARS)).isoformat()
    weekly = {}
    for day in sorted(d for d in daily if d >= start):
        year, week, _ = dt.date.fromisoformat(day).isocalendar()
        weekly[(year, week)] = day  # later days in the week replace earlier ones

    dates = sorted(weekly.values())
    yields = [y for d in dates for y in daily[d]]
    if len(dates) < 400 or not all(-1 < y < 15 for y in yields):
        print(f"Refusing to write: {len(dates)} weeks, yield range {min(yields)}–{max(yields)}")
        return 1

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "asOf": dates[-1],
                "source": "Bank of England",
                "description": "UK nominal gilt spot curves, 1 to 30 years, weekly",
                "maturities": HISTORY_MATURITIES,
                "curves": [{"date": d, "yields": daily[d]} for d in dates],
            },
            separators=(",", ":"),
        )
        + "\n"
    )
    print(f"Wrote {len(dates)} curves, {dates[0]} to {dates[-1]}, {OUT.stat().st_size} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
