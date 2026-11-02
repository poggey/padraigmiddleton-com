"""
Escape Velocity: SPCX daily closes from listing, with the $135 IPO price. Reads
data/spcx_daily.json from the escape-velocity repo and refuses stub data.
"""

import json
import sys
from pathlib import Path

repo = Path(sys.argv[1])
daily = json.loads((repo / "data/spcx_daily.json").read_text())
if daily.get("is_stub", True):
    sys.exit("spcx_daily.json is stub data: not exporting")

rows = daily["rows"]
close_key = next(k for k in ("close", "Close", "adj_close") if k in rows[0])
out = {
    "source": daily["source"],
    "ticker": daily["ticker"],
    "ipoPrice": daily["ipo_price"],
    "verified": True,  # live yfinance data (is_stub false), checked against the repo
    "series": [[r["date"], round(float(r[close_key]), 2)] for r in rows],
}
path = Path("public/data/projects/escape-velocity.json")
path.write_text(json.dumps(out, separators=(",", ":")) + "\n")
print(f"Wrote {path} ({path.stat().st_size} bytes), {len(rows)} days")
