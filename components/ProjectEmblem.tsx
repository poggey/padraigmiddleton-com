import { EscapeEmblem } from "@/components/project-emblems/EscapeEmblem";
import { FourierEmblem } from "@/components/project-emblems/FourierEmblem";
import { OptimiserEmblem } from "@/components/project-emblems/OptimiserEmblem";
import { RiskEmblem } from "@/components/project-emblems/RiskEmblem";
import { SlateEmblem } from "@/components/project-emblems/SlateEmblem";
import { StirlingEmblem } from "@/components/project-emblems/StirlingEmblem";
import { Reveal } from "@/components/Reveal";

// Each featured project's emblem: a small drawing of the idea behind it, not its data. They share
// a 64-unit square, thin lines in the current colour and one thing in gold, and each moves once
// when its project is pointed at (the data-emblem rules in globals.css).
const emblems: Record<string, () => React.ReactNode> = {
  "risk-dashboard": RiskEmblem,
  "fourier-option-pricing": FourierEmblem,
  "portfolio-optimiser": OptimiserEmblem,
  "escape-velocity": EscapeEmblem,
  stirling: StirlingEmblem,
  "the-slate": SlateEmblem,
};

export const emblemSlugs = Object.keys(emblems);

export function ProjectEmblem({ slug }: { slug: string }) {
  const Emblem = emblems[slug];
  if (!Emblem) throw new Error(`No project emblem for "${slug}"`);
  return (
    <Reveal className="shrink-0">
      <svg
        aria-hidden
        viewBox="0 0 64 64"
        className="block size-16 border border-night-line bg-night text-night-muted transition-[color,border-color] duration-(--dur-hover) group-is-hover:border-night-line-strong group-is-hover:text-night-text md:size-20 lg:size-24"
      >
        <Emblem />
      </svg>
    </Reveal>
  );
}
