import { cx } from "@/lib/cx";

type Status = "open" | "right" | "wrong" | "void";

const dot: Record<Status, string> = {
  open: "bg-gilt",
  right: "bg-signal",
  wrong: "bg-slate",
  void: "bg-line-strong",
};

const statusLabel: Record<Status, string> = {
  open: "Open",
  right: "Right",
  wrong: "Wrong",
  void: "Void",
};

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
        "inline-flex h-7 items-center rounded-pill px-3 text-small",
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

/** Prediction status. The word carries the meaning; the dot only reinforces it. */
export function StatusChip({
  status,
  tone = "light",
}: {
  status: Status;
  tone?: "light" | "night";
}) {
  return (
    <Chip tone={tone} className="gap-2 font-semibold">
      <span aria-hidden className={cx("size-2 rounded-full", dot[status])} />
      <span className={tone === "light" ? "text-ink" : "text-night-text"}>
        {statusLabel[status]}
      </span>
    </Chip>
  );
}
