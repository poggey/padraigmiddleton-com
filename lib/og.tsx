import { readFileSync } from "node:fs";
import path from "node:path";
import { smoothCurve } from "@/lib/curves";
import gilts from "@/public/data/gilt-curves.json";

/**
 * Shared pieces for the generated social images (next/og). Images cannot read CSS variables,
 * so the few colours they need are repeated here; they mirror the tokens in app/globals.css.
 */
export const og = {
  size: { width: 1200, height: 630 },
  night: "#0b1424",
  nightText: "#e8ecf4",
  nightMuted: "#a6b0c3",
  signal: "#2d5be3",
  signalSoft: "#8fa8ff",
  gilt: "#c9a227",
  glassBg: "rgba(255, 255, 255, 0.07)",
  glassBorder: "rgba(255, 255, 255, 0.18)",
};

/** Schibsted Grotesk as static TrueType files: next/og cannot read woff2 or variable fonts. */
export function ogFonts() {
  const font = (file: string) => readFileSync(path.join(process.cwd(), "assets/fonts", file));
  return [
    { name: "Schibsted Grotesk", data: font("SchibstedGrotesk-Medium.ttf"), weight: 500 as const },
    {
      name: "Schibsted Grotesk",
      data: font("SchibstedGrotesk-SemiBold.ttf"),
      weight: 600 as const,
    },
  ];
}

/**
 * A slice of the hero's curve field, as SVG: every third day of the last 60 in soft blue, older
 * curves further back and fainter, and the latest close in gold.
 */
export function CurveSlice({ width, height }: { width: number; height: number }) {
  const SAMPLES = 32;
  const logs = gilts.maturities.map(Math.log);
  const at = Array.from(
    { length: SAMPLES },
    (_, i) => logs[0] + ((logs[logs.length - 1] - logs[0]) * i) / (SAMPLES - 1),
  );
  const all = gilts.curves.flatMap((c) => c.yields);
  const [low, high] = [Math.min(...all), Math.max(...all)];
  const last = gilts.curves.length - 1;

  const path = (yields: number[], age: number) =>
    yields
      .map((y, i) => {
        const back = 1 - age;
        const x = width * (0.04 + (i / (SAMPLES - 1)) * 0.9 + back * 0.06);
        const top = height * (0.86 - ((y - low) / (high - low)) * 0.42 - back * 0.4);
        return `${i ? "L" : "M"}${x.toFixed(1)},${top.toFixed(1)}`;
      })
      .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {gilts.curves.map((curve, d) => {
        if (d % 3 !== 0 && d !== last) return null;
        const age = d / last;
        const latest = d === last;
        return (
          <path
            key={curve.date}
            d={path(smoothCurve(logs, curve.yields, at), age)}
            fill="none"
            stroke={latest ? og.gilt : og.signalSoft}
            strokeOpacity={latest ? 1 : 0.12 + 0.45 * age}
            strokeWidth={latest ? 3 : 1.5}
          />
        );
      })}
    </svg>
  );
}
