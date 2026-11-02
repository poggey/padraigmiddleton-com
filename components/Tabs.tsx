"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";

export type TabItem = { id: string; label: React.ReactNode };

/**
 * Tabs with a sliding indicator. Horizontal tabs sit in a row (filters, toggles); vertical tabs
 * are a ruled list of rows with a blue bar beside the selected one (the experience section).
 * Arrow keys, Home and End move between tabs.
 * The parent renders the panel with id `${idPrefix}-panel` and role="tabpanel".
 *
 * The indicator is one element moved with a CSS transition to the selected tab's position.
 */
export function Tabs({
  label,
  items,
  value,
  onChange,
  idPrefix,
  tone = "light",
  orientation = "horizontal",
  className,
}: {
  label: string;
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  idPrefix: string;
  tone?: "light" | "night";
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const list = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const vertical = orientation === "vertical";
  const index = Math.max(
    0,
    items.findIndex((item) => item.id === value),
  );

  // Move the indicator onto the selected tab, and again whenever the tabs change size.
  useEffect(() => {
    const bar = indicator.current;
    const container = list.current;
    if (!bar || !container) return;
    const place = () => {
      const tab = refs.current[index];
      if (!tab) return;
      bar.style.translate = `${tab.offsetLeft}px ${tab.offsetTop}px`;
      if (!vertical) bar.style.width = `${tab.offsetWidth}px`;
      bar.style.height = `${tab.offsetHeight}px`;
    };
    place();
    // Only animate after the first placement, so nothing slides in on page load.
    const frame = requestAnimationFrame(() => (bar.dataset.ready = "true"));
    const resizer = new ResizeObserver(place);
    resizer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
    };
  }, [index, items.length, vertical]);

  function onKeyDown(event: React.KeyboardEvent, i: number) {
    const last = items.length - 1;
    const next = {
      [vertical ? "ArrowDown" : "ArrowRight"]: i === last ? 0 : i + 1,
      [vertical ? "ArrowUp" : "ArrowLeft"]: i === 0 ? last : i - 1,
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
      ref={list}
      role="tablist"
      aria-label={label}
      aria-orientation={orientation}
      className={cx(
        "relative",
        vertical
          ? "flex flex-col border-t border-line"
          : cx(
              "inline-flex max-w-full gap-1 overflow-x-auto rounded-[8px] p-1",
              tone === "light" ? "bg-ink/6" : "bg-night-line",
            ),
        className,
      )}
    >
      <span
        ref={indicator}
        aria-hidden
        className={cx(
          "absolute top-0 left-0",
          "data-[ready=true]:transition-[translate,width,height] data-[ready=true]:duration-(--dur-ui) data-[ready=true]:ease-out",
          vertical
            ? "z-10 w-0.5 bg-signal"
            : tone === "light"
              ? "rounded-control bg-paper shadow-e1"
              : "rounded-control bg-night-line-strong",
        )}
      />
      {items.map((item, i) => {
        const selected = i === index;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => onKeyDown(event, i)}
            className={cx(
              "relative shrink-0 transition-colors duration-(--dur-ui) ease-out",
              vertical
                ? "min-h-11 border-b border-line py-4 pr-4 pl-5 text-left"
                : "h-10 rounded-control px-4 text-small font-semibold",
              tone === "light"
                ? selected
                  ? "text-ink"
                  : "text-slate is-hover:text-ink"
                : selected
                  ? "text-night-text"
                  : "text-night-muted is-hover:text-night-text",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
