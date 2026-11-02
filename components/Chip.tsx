import { cx } from "@/lib/cx";

/** Tags such as "Gilts". */
export function Chip({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "night";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-7 items-center rounded-inline px-2.5 text-small",
        tone === "light"
          ? "bg-paper text-slate shadow-e0"
          : "bg-night-raised text-night-muted shadow-[inset_0_0_0_1px_var(--night-line)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
