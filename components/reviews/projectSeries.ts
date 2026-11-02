import escape from "@/public/data/projects/escape-velocity.json";
import fourier from "@/public/data/projects/fourier-option-pricing.json";
import optimiser from "@/public/data/projects/portfolio-optimiser.json";
import risk from "@/public/data/projects/risk-dashboard.json";
import slate from "@/public/data/projects/the-slate.json";
import stirling from "@/public/data/projects/stirling.json";

// Each featured project's own exported data, reduced to one shape that every prototype can draw
// in its own style: lines, dots or bars on two axes, with exactly one gold mark for the thing that
// matters. The data is the same as the live site's project graphics; only the drawing changes.

type Point = [number, number];
export type Tick = { at: number; label: string };

export type ProjectSeries = {
  x: [number, number];
  y: [number, number];
  /** The main line (and, for the optimiser, the cloud of portfolios as faint dots). */
  line?: Point[];
  dots?: Point[];
  bars?: { at: number; value: number }[];
  /** The one gold mark: a point, a level across the chart, or one bar. */
  gold:
    | { kind: "point"; at: Point; label: string }
    | { kind: "level"; y: number; label: string }
    | { kind: "bar"; index: number; label: string }
    | { kind: "dots"; points: Point[]; label: string };
  xTicks: Tick[];
  yTicks: Tick[];
  summary: string;
};

const day = (iso: string) => Date.parse(`${iso}T12:00:00Z`) / 86_400_000;
const shortDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
const pct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(Math.round(v * 100))}%`;

function riskSeries(): ProjectSeries {
  const line = risk.series.map(([d, v]) => [day(d as string), v as number] as Point);
  const trough = line.reduce((lo, p) => (p[1] < lo[1] ? p : lo));
  const years = [2022, 2023, 2024, 2025, 2026];
  return {
    x: [line[0][0], line.at(-1)![0]],
    y: [-0.2, 0.35],
    line,
    gold: {
      kind: "point",
      at: trough,
      label: `${(risk.drawdown.depth * 100).toFixed(1).replace("-", "−")}% drawdown`,
    },
    xTicks: years.map((y) => ({ at: day(`${y}-01-01`), label: String(y) })),
    yTicks: [-0.1, 0, 0.1, 0.2, 0.3].map((v) => ({ at: v, label: pct(v) })),
    summary: `Cumulative return of an equal-weight multi-asset portfolio, ${risk.from} to ${risk.to}, with its lowest point in gold.`,
  };
}

function fourierSeries(): ProjectSeries {
  const exact = fourier.points.map(([k, , bs]) => [k, bs] as Point);
  const fft = fourier.points.map(([k, f]) => [k, f] as Point);
  return {
    x: [50, 200],
    y: [0, 55],
    line: exact,
    gold: {
      kind: "dots",
      points: fft.filter((_, i) => i % 3 === 0),
      label: "FFT prices on the Black-Scholes line",
    },
    xTicks: [50, 100, 150, 200].map((v) => ({ at: v, label: String(v) })),
    yTicks: [0, 25, 50].map((v) => ({ at: v, label: String(v) })),
    summary:
      "Call prices by strike from the Fourier method, in gold, sitting exactly on the Black-Scholes prices.",
  };
}

function optimiserSeries(): ProjectSeries {
  const { maxSharpe } = optimiser;
  return {
    x: [0.065, 0.15],
    y: [-0.035, 0.135],
    dots: optimiser.cloud as Point[],
    line: optimiser.frontier as Point[],
    gold: {
      kind: "point",
      at: [maxSharpe.vol, maxSharpe.ret],
      label: `Max Sharpe ${maxSharpe.sharpe.toFixed(2)}`,
    },
    xTicks: [0.08, 0.1, 0.12, 0.14].map((v) => ({ at: v, label: `${Math.round(v * 100)}%` })),
    yTicks: [0, 0.05, 0.1].map((v) => ({ at: v, label: `${Math.round(v * 100)}%` })),
    summary: `Random portfolios of eight ETFs by risk and return, the efficient frontier, and the maximum-Sharpe portfolio in gold (Sharpe ${maxSharpe.sharpe}).`,
  };
}

function escapeSeries(): ProjectSeries {
  const line = escape.series.map(([d, v]) => [day(d as string), v as number] as Point);
  const first = escape.series[0][0] as string;
  const last = escape.series.at(-1)![0] as string;
  return {
    x: [line[0][0], line.at(-1)![0]],
    y: [120, 220],
    line,
    gold: { kind: "level", y: escape.ipoPrice, label: `$${escape.ipoPrice} IPO price` },
    xTicks: [first, last].map((d) => ({ at: day(d), label: shortDate(d) })),
    yTicks: [150, 200].map((v) => ({ at: v, label: `$${v}` })),
    summary: `Daily closing price after the June 2026 listing, against the $${escape.ipoPrice} IPO price in gold.`,
  };
}

function stirlingSeries(): ProjectSeries {
  const count = stirling.editions[0].number;
  return {
    x: [0, count + 1],
    y: [0, 1],
    // Every mark the same height: the data is the count of editions, nothing more.
    bars: Array.from({ length: count }, (_, i) => ({ at: i + 1, value: 0.6 })),
    gold: {
      kind: "bar",
      index: count - 1,
      label: `No. ${count}, ${shortDate(stirling.editions[0].date)}`,
    },
    xTicks: [1, 60, count].map((v) => ({ at: v, label: `No. ${v}` })),
    yTicks: [],
    summary: `One mark for each of the ${count} daily editions, the latest in gold.`,
  };
}

function slateSeries(): ProjectSeries {
  // The median film (−10%) falls in the −25% to 0 bin.
  const median = slate.bins.findIndex((b) => b.from === "−25%");
  return {
    x: [-0.5, slate.bins.length - 0.5],
    y: [0, 16],
    bars: slate.bins.map((b, i) => ({ at: i, value: b.count })),
    gold: {
      kind: "bar",
      index: median,
      label: `Median film ${slate.medianRoi}%`.replace("-", "−"),
    },
    xTicks: [0, 4, slate.bins.length - 1].map((i) => ({ at: i, label: slate.bins[i].from })),
    yTicks: [0, 5, 10, 15].map((v) => ({ at: v, label: String(v) })),
    summary: `Return on investment of ${slate.films} A24 films, grouped into bins, with the median film's bin in gold.`,
  };
}

const builders: Record<string, () => ProjectSeries> = {
  "risk-dashboard": riskSeries,
  "fourier-option-pricing": fourierSeries,
  "portfolio-optimiser": optimiserSeries,
  "escape-velocity": escapeSeries,
  stirling: stirlingSeries,
  "the-slate": slateSeries,
};

export function projectSeries(slug: string): ProjectSeries | undefined {
  return builders[slug]?.();
}
