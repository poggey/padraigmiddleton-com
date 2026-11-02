import { readFileSync } from "node:fs";
import { ImageResponse } from "next/og";
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
  glow: "rgba(45, 91, 227, 0.22)",
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

/**
 * The frame every social image shares (1200 × 630): night ground with the hero's soft light, a
 * slice of the curve field on the right, a small label and a large title on the left, an optional
 * figure on a glass chip, and the domain at the bottom.
 */
export function ogImage({
  label,
  title,
  titleSize = 76,
  line,
  figure,
  domain,
}: {
  label: string;
  title: string;
  titleSize?: number;
  line?: string;
  figure?: { figure: string; label: string };
  domain: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: og.night,
        backgroundImage: `radial-gradient(60% 60% at 75% 0%, ${og.glow}, transparent 70%)`,
        color: og.nightText,
        fontFamily: "Schibsted Grotesk",
      }}
    >
      <div style={{ position: "absolute", right: 0, top: 30, display: "flex" }}>
        <CurveSlice width={580} height={580} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px 56px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 700 }}>
          <div style={{ fontSize: 26, fontWeight: 500, color: og.nightMuted }}>{label}</div>
          <div
            style={{
              marginTop: 20,
              fontSize: titleSize,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              textWrap: "balance",
            }}
          >
            {title}
          </div>
          {line && (
            <div
              style={{
                marginTop: 24,
                maxWidth: 560,
                fontSize: 28,
                fontWeight: 500,
                lineHeight: 1.35,
                color: og.nightMuted,
              }}
            >
              {line}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {figure && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: 540,
                padding: "20px 28px",
                borderRadius: 8,
                backgroundColor: og.glassBg,
                border: `1px solid ${og.glassBorder}`,
              }}
            >
              <div
                style={{ flexShrink: 0, fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                {figure.figure}
              </div>
              <div
                style={{
                  marginLeft: 24,
                  fontSize: 22,
                  fontWeight: 500,
                  lineHeight: 1.35,
                  color: og.nightMuted,
                }}
              >
                {figure.label}
              </div>
            </div>
          )}
          <div style={{ fontSize: 22, fontWeight: 500, color: og.nightMuted }}>{domain}</div>
        </div>
      </div>
    </div>,
    { ...og.size, fonts: ogFonts() },
  );
}
