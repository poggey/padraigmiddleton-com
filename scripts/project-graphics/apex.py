"""
APEX: the teammate network that makes driver and car separable. Drivers are nodes; a link
joins two drivers who shared a car-season (weight = how many). Positions come from a seeded
force-directed layout computed here, at build time, so the site only draws the result.
Reads analysis/apex.json from the f1-pace-analyser repo.
"""

import json
import sys
from pathlib import Path

import numpy as np

repo = Path(sys.argv[1])
apex = json.loads((repo / "analysis/apex.json").read_text())
network = apex["network"]
skill = {d["code"]: d["skill"] for d in apex["drivers"]}
names = {d["code"]: d["name"] for d in apex["drivers"]}

nodes = network["nodes"]
index = {code: i for i, code in enumerate(nodes)}
edges = [(index[a], index[b], w) for a, b, w in network["edges"]]

# Fruchterman–Reingold, seeded so the picture is the same on every build.
rng = np.random.default_rng(7)
pos = rng.uniform(-1, 1, (len(nodes), 2))
k = 1.6 / np.sqrt(len(nodes))
temperature = 0.2
for step in range(600):
    delta = pos[:, None, :] - pos[None, :, :]
    dist = np.linalg.norm(delta, axis=2) + 1e-9
    force = (k * k / dist**2)[:, :, None] * delta
    disp = force.sum(axis=1)
    for a, b, w in edges:
        d = pos[a] - pos[b]
        length = np.linalg.norm(d) + 1e-9
        pull = (length * length / k) * (1 + 0.3 * (w - 1)) * d / length / length
        disp[a] -= pull
        disp[b] += pull
    disp -= 0.02 * pos  # gentle gravity keeps the graph compact
    length = np.linalg.norm(disp, axis=1)[:, None] + 1e-9
    pos += disp / length * np.minimum(length, temperature)
    temperature *= 0.992

# Fit into a 0–1 box, wider than tall, to sit in a card.
pos -= pos.min(axis=0)
pos /= pos.max(axis=0)

out = {
    "source": "APEX, analysis/apex.json (teammate network, 2018–2024)",
    "laps": apex["meta"]["n_laps"],
    "connected": network["connected"],
    "nodes": [
        {
            "code": code,
            "name": names.get(code, code),
            "x": round(float(pos[i, 0]), 3),
            "y": round(float(pos[i, 1]), 3),
            "skill": round(skill.get(code, 0.0), 3),
        }
        for i, code in enumerate(nodes)
    ],
    "edges": [[a, b, w] for a, b, w in edges],
}
path = Path("public/data/projects/apex.json")
path.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n")
print(f"Wrote {path} ({path.stat().st_size} bytes): {len(nodes)} drivers, {len(edges)} links")
