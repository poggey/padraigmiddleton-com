"""
Portfolio Risk Dashboard: the Multi-Asset preset (VWRL.L, IGLT.L, SGLN.L, IUKP.L, equal weight)
over five years to 30 October 2026, run through the dashboard's own src/metrics.py. Exports the
cumulative return (weekly), the maximum drawdown window and the 95% one-day VaR.
"""

import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
import yfinance as yf

repo = Path(sys.argv[1])
spec = importlib.util.spec_from_file_location("metrics", repo / "src/metrics.py")
metrics = importlib.util.module_from_spec(spec)
spec.loader.exec_module(metrics)

TICKERS = ["VWRL.L", "IGLT.L", "SGLN.L", "IUKP.L"]
START, END = "2021-10-30", "2026-10-31"

prices = yf.download(TICKERS, start=START, end=END, progress=False, auto_adjust=True)["Close"]
returns = prices[TICKERS].dropna().pct_change().dropna()
port = metrics.portfolio_returns(returns, np.full(len(TICKERS), 1 / len(TICKERS)))

wealth = (1 + port).cumprod()
drawdown = metrics.drawdown_series(port)
trough = drawdown.idxmin()
peak = wealth[:trough].idxmax()
recovered = wealth[trough:][wealth[trough:] >= wealth[peak]]
end = recovered.index[0] if len(recovered) else wealth.index[-1]

weekly = wealth.resample("W-FRI").last().dropna()
out = {
    "source": "Portfolio Risk Dashboard, src/metrics.py on the Multi-Asset preset (prices from Yahoo Finance)",
    "preset": "Multi-Asset, equal weight: global equity, gilts, gold, UK property",
    "from": str(wealth.index[0].date()),
    "to": str(wealth.index[-1].date()),
    "series": [[str(d.date()), round(float(v) - 1, 4)] for d, v in weekly.items()],
    "drawdown": {
        "from": str(peak.date()),
        "to": str(end.date()),
        "depth": round(float(drawdown.min()), 4),
        "recovered": bool(len(recovered)),
    },
    "var95": round(float(metrics.value_at_risk(port, 0.95)), 4),
    "sharpe": round(float(metrics.sharpe_ratio(port)), 2),
}
path = Path("public/data/projects/risk-dashboard.json")
path.write_text(json.dumps(out, separators=(",", ":")) + "\n")
print(f"Wrote {path} ({path.stat().st_size} bytes), {len(weekly)} weeks")
print(f"  total return {wealth.iloc[-1] - 1:+.1%}, max drawdown {drawdown.min():.1%} ({peak.date()} to {end.date()}), 95% one-day VaR {out['var95']:.2%}")
