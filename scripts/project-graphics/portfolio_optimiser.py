"""
Portfolio Optimiser: re-runs the notebook's method (eight London-listed ETFs, 2020 to 2025,
4% risk-free rate) to export 800 of 10,000 random portfolios, the efficient frontier and the
maximum-Sharpe point. The notebook used no random seed, so the cloud is a fresh draw (seed 0);
the frontier and the maximum-Sharpe portfolio do not depend on it.
"""

import json
import sys
from pathlib import Path

import numpy as np
import yfinance as yf
from scipy.optimize import minimize

TICKERS = ["ISF.L", "VWRL.L", "IGLT.L", "IBTM.L", "INXG.L", "SGLN.L", "SLXX.L", "IUKP.L"]
RFR = 0.04

prices = yf.download(TICKERS, start="2020-01-01", end="2025-01-01", progress=False, auto_adjust=True)["Close"]
returns = prices[TICKERS].dropna().pct_change().dropna()
mean = returns.mean() * 252
cov = returns.cov()


def perf(w):
    ret = float(np.dot(w, mean))
    vol = float(np.sqrt(w @ (cov.values * 252) @ w))
    return ret, vol, (ret - RFR) / vol


bounds = [(0, 1)] * len(TICKERS)
sum_to_one = {"type": "eq", "fun": lambda w: np.sum(w) - 1}
start = np.full(len(TICKERS), 1 / len(TICKERS))
best = minimize(lambda w: -perf(w)[2], start, method="SLSQP", bounds=bounds, constraints=[sum_to_one]).x
min_var = minimize(lambda w: perf(w)[1], start, method="SLSQP", bounds=bounds, constraints=[sum_to_one]).x

rng = np.random.default_rng(0)
cloud = []
for _ in range(10_000):
    w = rng.random(len(TICKERS))
    cloud.append(perf(w / w.sum()))
sample = rng.choice(len(cloud), 800, replace=False)

frontier = []
for target in np.linspace(perf(min_var)[0], float(mean.max()), 28):
    on_target = {"type": "eq", "fun": lambda w, t=target: np.dot(w, mean) - t}
    w = minimize(lambda w: perf(w)[1], start, method="SLSQP", bounds=bounds, constraints=[sum_to_one, on_target]).x
    r, v, _ = perf(w)
    frontier.append([round(v, 4), round(r, 4)])

r, v, s = perf(best)
equal = perf(start)
out = {
    "source": "Portfolio Optimiser, re-run of notebook.ipynb (prices from Yahoo Finance)",
    "cloud": [[round(cloud[i][1], 4), round(cloud[i][0], 4)] for i in sample],
    "frontier": frontier,
    "maxSharpe": {"vol": round(v, 4), "ret": round(r, 4), "sharpe": round(s, 2)},
    "equalWeightSharpe": round(equal[2], 2),
    "weights": {t: round(float(w), 3) for t, w in zip(TICKERS, best) if w > 0.005},
}
path = Path("public/data/projects/portfolio-optimiser.json")
path.write_text(json.dumps(out, separators=(",", ":")) + "\n")
print(f"Wrote {path} ({path.stat().st_size} bytes)")
print(f"  max Sharpe {s:.3f} (site says 0.76), equal weight {equal[2]:.3f} (site says −0.31)")
print(f"  weights {out['weights']} (site says 56% gold, 44% global equity)")
