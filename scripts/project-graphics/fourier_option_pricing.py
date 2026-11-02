"""
Fourier Option Pricing: runs the repo's own pricing.py on the README's running example (share
price 100, one year, 4% interest, 20% volatility, damping 1.5) and exports the call price at the
FFT grid strikes from 50 to 200, from the FFT and from the Black-Scholes formula, and the largest
gap between them.
"""

import importlib.util
import json
import sys
from pathlib import Path

import numpy as np

repo = Path(sys.argv[1])
spec = importlib.util.spec_from_file_location("pricing", repo / "pricing.py")
pricing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pricing)

S0, R, T, VOL = 100, 0.04, 1.0, 0.2
strikes, fft_prices = pricing.price_all_strikes(S0, R, T, VOL, damping=1.5)
inside = (strikes >= 50) & (strikes <= 200)
strikes, fft_prices = strikes[inside], fft_prices[inside]
exact = pricing.bs_price(S0, strikes, R, T, VOL)
gap = float(np.max(np.abs(fft_prices - exact)))

# Every fifth grid strike is plenty to draw; the gap is measured on all of them.
every = slice(None, None, 5)
out = {
    "source": "Fourier Option Pricing, pricing.py run on the README's example",
    "example": {"share": S0, "rate": R, "years": T, "vol": VOL, "damping": 1.5},
    "gridStrikes": int(inside.sum()),
    "points": [
        [round(float(k), 2), round(float(f), 4), round(float(e), 4)]
        for k, f, e in zip(strikes[every], fft_prices[every], exact[every])
    ],
    "maxGap": float(f"{gap:.1g}"),
}
path = Path("public/data/projects/fourier-option-pricing.json")
path.write_text(json.dumps(out, separators=(",", ":")) + "\n")
print(f"Wrote {path} ({path.stat().st_size} bytes)")
print(f"  {out['gridStrikes']} grid strikes from 50 to 200, largest gap {gap:.2e} (README says 6e-14)")
