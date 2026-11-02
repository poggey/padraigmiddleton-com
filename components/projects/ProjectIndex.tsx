"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClasses, Chevron } from "@/components/Button";
import { cx } from "@/lib/cx";
import type { ProjectItem } from "./items";

/**
 * The projects as a ruled index. On wide screens, pointing at or tabbing to a project shows it in
 * the preview beside the list: its graphic and a ruled panel with the result, the tools and the
 * status. On phones each project shows its graphic in the list instead.
 */
export function ProjectIndex({ items, heading = 3 }: { items: ProjectItem[]; heading?: 2 | 3 }) {
  const [active, setActive] = useState(items[0].slug);
  const current = items.find((item) => item.slug === active) ?? items[0];
  const Heading = heading === 2 ? "h2" : "h3";

  return (
    <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
      <ul className="border-t border-night-line">
        {items.map((item) => {
          const selected = item.slug === current.slug;
          return (
            <li key={item.slug} className="border-b border-night-line">
              <Link
                href={item.href}
                onPointerEnter={() => setActive(item.slug)}
                onFocus={() => setActive(item.slug)}
                className="group relative block rounded-[2px] py-6 pr-2 pl-5"
              >
                <span
                  aria-hidden
                  className={cx(
                    "absolute inset-y-0 left-0 w-0.5 transition-colors duration-(--dur-hover)",
                    selected ? "lg:bg-gilt" : "bg-transparent",
                  )}
                />
                <span className="flex justify-between gap-4 text-small text-night-muted">
                  <span>{item.kind}</span>
                  <span className="tabular-nums">{item.year}</span>
                </span>
                <Heading
                  className={cx(
                    "mt-1 text-h3 transition-colors duration-(--dur-hover)",
                    selected ? "text-night-text" : "text-night-text lg:text-night-muted",
                    "group-is-hover:text-night-text",
                  )}
                >
                  {item.title}
                </Heading>
                <span className="mt-2 block max-w-[46ch] text-night-muted">{item.oneLine}</span>
              </Link>
              <div aria-hidden className="pb-8 pl-5 lg:hidden">
                {item.graphic}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden lg:block">
        <div className="sticky top-24">
          <Preview key={current.slug} item={current} />
        </div>
      </div>
    </div>
  );
}

function Preview({ item }: { item: ProjectItem }) {
  return (
    // A second way to the same case study for the mouse; keyboard and screen reader users get the
    // link in the list, so this one is hidden from them.
    <Link
      href={item.href}
      tabIndex={-1}
      aria-hidden
      className="block rounded-card bg-night-raised shadow-[inset_0_0_0_1px_var(--night-line)] transition-[opacity,box-shadow] duration-(--dur-ui) ease-out starting:opacity-0 is-hover:shadow-[inset_0_0_0_1px_var(--night-line-strong)]"
    >
      <div className="p-8">{item.largeGraphic}</div>
      <dl className="grid grid-cols-2 border-t border-night-line text-small">
        {item.keyResult && (
          <div className="col-span-2 border-b border-night-line px-8 py-5">
            <dt className="text-night-muted">Result</dt>
            <dd className="mt-1 flex items-baseline gap-3">
              <span className="text-h3 text-gilt">{item.keyResult.figure}</span>
              <span className="text-night-muted">{item.keyResult.label}</span>
            </dd>
          </div>
        )}
        <div className="border-r border-night-line px-8 py-5">
          <dt className="text-night-muted">Built with</dt>
          <dd className="mt-1 text-night-text">{item.stack}</dd>
        </div>
        <div className="px-8 py-5">
          <dt className="text-night-muted">Status</dt>
          <dd className="mt-1 text-night-text">
            {item.status}, {item.year}
          </dd>
        </div>
      </dl>
      <div className="flex items-center justify-between gap-4 border-t border-night-line px-8 py-5">
        <span className="font-semibold text-night-text">{item.title}</span>
        <span className={buttonClasses({ tone: "night", size: "sm" })}>
          Read the case study
          <Chevron />
        </span>
      </div>
    </Link>
  );
}
