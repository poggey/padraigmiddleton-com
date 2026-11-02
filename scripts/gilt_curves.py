"""
Builds public/data/gilt-curves.json: UK nominal gilt spot curves for the last 60 trading days.

Source: Bank of England yield curve data (the "4. spot curve" sheet of its nominal daily files).
Each run downloads the current month's file and merges it into the history already committed,
so only the small monthly file is needed day to day. If there is not yet enough history, the
yearly archive is downloaded once to fill it.

Run from the project root:  python3 scripts/gilt_curves.py
Needs openpyxl (pip install -r scripts/requirements.txt).
"""

import datetime as dt
import io
import json
import sys
import urllib.request
import zipfile
from pathlib import Path

import openpyxl

OUT = Path("public/data/gilt-curves.json")
DAYS = 60
# Maturities in years. Denser at the short end, where the curve bends most.
MATURITIES = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30]

BASE = "https://www.bankofengland.co.uk/-/media/boe/files/statistics/yield-curves/"
LATEST = BASE + "latest-yield-curve-data.zip"
ARCHIVE = BASE + "glcnominalddata.zip"
USER_AGENT = "padraigmiddleton.com (personal site; daily gilt curve snapshot)"


def download(url: str) -> zipfile.ZipFile:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=120) as response:
        return zipfile.ZipFile(io.BytesIO(response.read()))


def read_spot_curves(book_bytes: bytes, maturities=MATURITIES) -> dict[str, list[float]]:
    """Returns {ISO date: yields at maturities} for every complete row of the spot curve sheet."""
    sheet = openpyxl.load_workbook(io.BytesIO(book_bytes), read_only=True, data_only=True)[
        "4. spot curve"
    ]
    rows = list(sheet.iter_rows(values_only=True))
    header = rows[3]  # "years:", 0.5, 1, 1.5 ...
    columns = [header.index(m) for m in maturities]

    curves = {}
    for row in rows[5:]:
        if not isinstance(row[0], dt.datetime):
            continue
        values = [row[c] for c in columns]
        # Skip holidays and days where any maturity is missing.
        if all(isinstance(v, (int, float)) for v in values):
            curves[row[0].date().isoformat()] = [round(v, 3) for v in values]
    return curves


def book(archive: zipfile.ZipFile, name_contains: str) -> bytes:
    name = next(n for n in archive.namelist() if name_contains in n)
    return archive.read(name)


def main() -> int:
    history = {}
    if OUT.exists():
        saved = json.loads(OUT.read_text())
        if saved.get("maturities") == MATURITIES:
            history = {c["date"]: c["yields"] for c in saved["curves"]}

    latest = read_spot_curves(book(download(LATEST), "GLC Nominal daily data current month"))
    history.update(latest)

    if len(history) < DAYS:
        print("Filling history from the yearly archive (about 40 MB)…")
        archive = download(ARCHIVE)
        history.update(read_spot_curves(book(archive, "2025 to present")))
        history.update(latest)

    dates = sorted(history)[-DAYS:]

    # Sanity checks: refuse to overwrite a good file with something odd.
    yields = [y for d in dates for y in history[d]]
    if len(dates) < 20 or not all(0 < y < 15 for y in yields):
        print(f"Refusing to write: {len(dates)} days, yield range {min(yields)}–{max(yields)}")
        return 1

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "asOf": dates[-1],
                "source": "Bank of England",
                "description": "UK nominal gilt spot curves, 6 months to 30 years",
                "maturities": MATURITIES,
                "curves": [{"date": d, "yields": history[d]} for d in dates],
            },
            separators=(",", ":"),
        )
        + "\n"
    )
    print(f"Wrote {len(dates)} curves, {dates[0]} to {dates[-1]}, {OUT.stat().st_size} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
