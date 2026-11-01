"use client";

import { cx } from "@/lib/cx";

// An on/off switch with a visible label. The whole row is the button.
export function Switch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx(
        "inline-flex min-h-11 items-center gap-3 rounded-pill pr-1 text-small font-medium",
        className,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "relative h-6 w-10 shrink-0 rounded-pill transition-colors duration-(--dur-ui) ease-out",
          checked ? "bg-signal" : "bg-line-strong",
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-paper shadow-e1",
            "transition-[translate] duration-(--dur-ui) ease-out",
            checked && "translate-x-4",
          )}
        />
      </span>
      {label}
    </button>
  );
}
