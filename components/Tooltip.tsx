import { cx } from "@/lib/cx";

/**
 * A small label shown above its trigger on hover and keyboard focus.
 * The trigger must be focusable and reference the tooltip with aria-describedby.
 */
export function Tooltip({
  id,
  content,
  children,
  open,
  className,
}: {
  id: string;
  content: React.ReactNode;
  children: React.ReactNode;
  /** Keeps it visible. Only /lab uses this. */
  open?: boolean;
  className?: string;
}) {
  return (
    <span className={cx("group/tip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        id={id}
        className={cx(
          "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-inline",
          "bg-paper px-3 py-1.5 text-small whitespace-nowrap text-ink shadow-e3",
          "transition-opacity duration-(--dur-hover) ease-out",
          open
            ? "opacity-100"
            : "opacity-0 group-focus-within/tip:opacity-100 group-hover/tip:opacity-100",
        )}
      >
        {content}
      </span>
    </span>
  );
}
