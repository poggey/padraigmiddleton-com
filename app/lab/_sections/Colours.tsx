import { readFileSync } from "node:fs";
import path from "node:path";
import { contrastRatio } from "@/lib/contrast";
import { LabSection, Label } from "./LabSection";

// Reads the hex values straight from globals.css, so this section can never drift from the tokens.
function readPalette() {
  const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
  return Object.fromEntries(
    [...css.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6});/g)].map(([, name, hex]) => [name, hex]),
  );
}

type Use = { name: string; job: string; grounds: string[] };

const light: Use[] = [
  { name: "porcelain", job: "Page ground", grounds: [] },
  { name: "paper", job: "Cards and raised surfaces", grounds: [] },
  { name: "ink", job: "Text, headlines, primary buttons", grounds: ["paper", "porcelain"] },
  { name: "slate", job: "Secondary text", grounds: ["paper", "porcelain"] },
  { name: "muted", job: "Meta text", grounds: ["paper", "porcelain"] },
  { name: "signal", job: "Links, focus, main data series", grounds: ["paper", "porcelain"] },
  { name: "gilt-deep", job: "Gold text on light", grounds: ["paper", "porcelain"] },
  { name: "gilt", job: "The point: fills and lines only", grounds: ["paper", "porcelain"] },
  { name: "line", job: "Hairlines, card borders", grounds: [] },
  { name: "line-strong", job: "Dividers, inputs, other series", grounds: [] },
];

const night: Use[] = [
  { name: "night", job: "The dark band and footer", grounds: [] },
  { name: "night-raised", job: "Cards on night", grounds: [] },
  { name: "night-text", job: "Text on night", grounds: ["night", "night-raised"] },
  { name: "night-muted", job: "Secondary text on night", grounds: ["night", "night-raised"] },
  {
    name: "signal-soft",
    job: "Main series and links on night",
    grounds: ["night", "night-raised"],
  },
  { name: "gilt", job: "The point, on night", grounds: ["night", "night-raised"] },
];

function rating(ratio: number) {
  if (ratio >= 4.5) return "text";
  if (ratio >= 3) return "large text, graphics";
  return "fills only";
}

function Swatch({
  use,
  palette,
  tone,
}: {
  use: Use;
  palette: Record<string, string>;
  tone: "light" | "night";
}) {
  const hex = palette[use.name];
  return (
    <li>
      <div
        className={`h-16 rounded-inline ${tone === "light" ? "shadow-e0" : "shadow-[inset_0_0_0_1px_var(--night-line)]"}`}
        style={{ background: `var(--${use.name})` }}
      />
      <p className="mt-3 text-small font-semibold">{use.name}</p>
      <Label tone={tone}>
        {hex.toUpperCase()}. {use.job}
      </Label>
      {use.grounds.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {use.grounds.map((ground) => {
            const ratio = contrastRatio(hex, palette[ground]);
            return (
              <li key={ground} className="text-small">
                {ratio.toFixed(2)} on {ground}
                <span className={tone === "light" ? "text-muted" : "text-night-muted"}>
                  , {rating(ratio)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

export function Colours() {
  const palette = readPalette();
  return (
    <>
      <LabSection
        id="colour"
        title="Colour"
        intro="Blue means you can interact with it, or it is the main series. Gold means this is the point. Contrast ratios are worked out from the tokens."
      >
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {light.map((use) => (
            <Swatch key={use.name} use={use} palette={palette} tone="light" />
          ))}
        </ul>
      </LabSection>
      <LabSection id="colour-night" title="On night" tone="night">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {night.map((use) => (
            <Swatch key={use.name} use={use} palette={palette} tone="night" />
          ))}
        </ul>
      </LabSection>
    </>
  );
}
