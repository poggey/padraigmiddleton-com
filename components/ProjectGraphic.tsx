import { ApexGraphic } from "@/components/project-graphics/ApexGraphic";
import { EscapeGraphic } from "@/components/project-graphics/EscapeGraphic";
import type { Variant } from "@/components/project-graphics/frame";
import { MarginaliaGraphic } from "@/components/project-graphics/MarginaliaGraphic";
import { OptimiserGraphic } from "@/components/project-graphics/OptimiserGraphic";
import { RiskGraphic } from "@/components/project-graphics/RiskGraphic";
import { SlateGraphic } from "@/components/project-graphics/SlateGraphic";
import { StirlingGraphic } from "@/components/project-graphics/StirlingGraphic";
import { Reveal } from "@/components/Reveal";

// Each project's miniature, chosen by the `graphic` key in its frontmatter. Data comes from
// public/data/projects/*.json, written by scripts/project-graphics/.
const graphics: Record<string, (props: { variant: Variant }) => React.ReactNode> = {
  "risk-drawdown": RiskGraphic,
  "stirling-editions": StirlingGraphic,
  "slate-returns": SlateGraphic,
  "optimiser-frontier": OptimiserGraphic,
  "escape-price": EscapeGraphic,
  "apex-network": ApexGraphic,
  "marginalia-shortlist": MarginaliaGraphic,
};

export const graphicKeys = Object.keys(graphics);

export function ProjectGraphic({
  graphic,
  variant = "card",
}: {
  graphic: string;
  variant?: Variant;
}) {
  const Graphic = graphics[graphic];
  if (!Graphic) throw new Error(`No project graphic called "${graphic}"`);
  return (
    <Reveal>
      <Graphic variant={variant} />
    </Reveal>
  );
}
