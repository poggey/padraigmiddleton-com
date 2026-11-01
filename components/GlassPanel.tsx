import { cx } from "@/lib/cx";

// Frosted glass for floating surfaces: hero cards, chips over graphics, the command menu.
export function GlassPanel({
  radius = "card",
  className,
  children,
}: {
  radius?: "inline" | "card";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx("glass", radius === "inline" ? "rounded-inline" : "rounded-card", className)}
    >
      {children}
    </div>
  );
}
