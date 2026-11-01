import { cx } from "@/lib/cx";

type Elevation = "e0" | "e1" | "e2" | "e3";
type Radius = "inline" | "card" | "feature" | "panel";

const elevations: Record<Elevation, string> = {
  e0: "shadow-e0",
  e1: "shadow-e1",
  e2: "shadow-e2",
  e3: "shadow-e3",
};

const radii: Record<Radius, string> = {
  inline: "rounded-inline",
  card: "rounded-card",
  feature: "rounded-feature",
  panel: "rounded-panel",
};

/**
 * A raised surface. Radius follows the job: inline panels 12, cards 20,
 * feature tiles 28, section panels 36. On night, depth comes from a hairline, not a shadow.
 */
export function Card({
  elevation = "e1",
  radius = "card",
  tone = "paper",
  as: Tag = "div",
  className,
  children,
}: {
  elevation?: Elevation;
  radius?: Radius;
  tone?: "paper" | "night";
  as?: "div" | "article" | "section" | "aside";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      data-tone={tone === "night" ? "night" : undefined}
      className={cx(
        radii[radius],
        tone === "paper"
          ? cx("bg-paper", elevations[elevation])
          : "bg-night-raised shadow-[inset_0_0_0_1px_var(--night-line)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
