import surface from "@/public/data/gilt-surface.json";
import { smoothCurve } from "@/lib/curves";

/**
 * The gilt yield-curve surface as a grid: maturity across (x, log scale), time from oldest at
 * the back to the latest close at the front (z), yield as height (y). Each weekly curve is
 * smoothed across maturities, and `between` extra rows are blended between neighbouring weeks.
 * `smooth` averages each week with that many weeks either side; the latest curve is kept exact.
 */
export function buildSurface(columns: number, between: number, smooth = 0) {
  const logs = surface.maturities.map(Math.log);
  const at = Array.from(
    { length: columns },
    (_, i) => logs[0] + ((logs[logs.length - 1] - logs[0]) * i) / (columns - 1),
  );
  const raw = surface.curves.map((c) => smoothCurve(logs, c.yields, at));
  const weeks = raw.map((week, w) => {
    if (!smooth || w === raw.length - 1) return week;
    const near = raw.slice(Math.max(0, w - smooth), Math.min(raw.length, w + smooth + 1));
    return week.map((_, i) => near.reduce((sum, n) => sum + n[i], 0) / near.length);
  });

  // Rows between weeks follow a smooth curve through each week's real values (no kinks).
  const steps = (weeks.length - 1) * (between + 1) + 1;
  const times = Array.from({ length: steps }, (_, r) => r / (between + 1));
  const index = weeks.map((_, w) => w);
  const columnsOverTime = at.map((_, c) =>
    smoothCurve(
      index,
      weeks.map((week) => week[c]),
      times,
    ),
  );
  const rows = times.map((_, r) => columnsOverTime.map((column) => column[r]));

  const all = surface.curves.flatMap((c) => c.yields);
  const low = Math.min(...all);
  const high = Math.max(...all);

  const count = rows.length * columns;
  const position = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  rows.forEach((row, r) => {
    row.forEach((y, c) => {
      const i = r * columns + c;
      const u = c / (columns - 1);
      const v = r / (rows.length - 1); // 0 oldest, 1 latest
      position[i * 3] = (u - 0.5) * 2.4;
      position[i * 3 + 1] = ((y - low) / (high - low)) * 0.75;
      position[i * 3 + 2] = (v - 0.5) * 1.7;
      uv[i * 2] = u;
      uv[i * 2 + 1] = v;
    });
  });

  // Normals from neighbouring points, for lighting.
  const normal = new Float32Array(count * 3);
  const p = (r: number, c: number) => {
    const i =
      (Math.min(rows.length - 1, Math.max(0, r)) * columns +
        Math.min(columns - 1, Math.max(0, c))) *
      3;
    return [position[i], position[i + 1], position[i + 2]];
  };
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < columns; c++) {
      const [ax, ay, az] = p(r, c + 1).map((v, k) => v - p(r, c - 1)[k]);
      const [bx, by, bz] = p(r + 1, c).map((v, k) => v - p(r - 1, c)[k]);
      let nx = by * az - bz * ay;
      let ny = bz * ax - bx * az;
      let nz = bx * ay - by * ax;
      const length = Math.hypot(nx, ny, nz) || 1;
      if (ny < 0) [nx, ny, nz] = [-nx, -ny, -nz];
      const i = (r * columns + c) * 3;
      normal[i] = nx / length;
      normal[i + 1] = ny / length;
      normal[i + 2] = nz / length;
    }
  }

  const indices: number[] = [];
  for (let r = 0; r < rows.length - 1; r++) {
    for (let c = 0; c < columns - 1; c++) {
      const a = r * columns + c;
      const b = a + columns;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  return {
    position,
    normal,
    uv,
    indices: new Uint16Array(indices),
    rows: rows.length,
    columns,
    weeks: weeks.length,
    from: surface.curves[0].date,
    asOf: surface.asOf,
  };
}
