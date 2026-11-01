"use client";

import { useRef } from "react";
import { m } from "motion/react";
import { spring } from "@/lib/motion";
import { cx } from "@/lib/cx";

export type TabItem = { id: string; label: string };

/**
 * A row of tabs with a sliding indicator. Arrow keys, Home and End move between tabs.
 * The parent renders the panel with id `${idPrefix}-panel` and role="tabpanel".
 */
export function Tabs({
  label,
  items,
  value,
  onChange,
  idPrefix,
  tone = "light",
  className,
}: {
  label: string;
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  idPrefix: string;
  tone?: "light" | "night";
  className?: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const last = items.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    refs.current[next]?.focus();
    onChange(items[next].id);
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx(
        "inline-flex max-w-full gap-1 overflow-x-auto rounded-pill p-1",
        tone === "light" ? "bg-ink/6" : "bg-night-line",
        className,
      )}
    >
      {items.map((item, index) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cx(
              "relative h-11 shrink-0 rounded-pill px-4 text-small font-semibold",
              "transition-colors duration-(--dur-ui) ease-out",
              tone === "light"
                ? selected
                  ? "text-ink"
                  : "text-slate is-hover:text-ink"
                : selected
                  ? "text-night-text"
                  : "text-night-muted is-hover:text-night-text",
            )}
          >
            {selected && (
              <m.span
                layoutId={`${idPrefix}-indicator`}
                transition={spring}
                className={cx(
                  "absolute inset-0 rounded-pill",
                  tone === "light" ? "bg-paper shadow-e1" : "bg-night-line-strong",
                )}
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
