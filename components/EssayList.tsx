"use client";

import { startTransition, useState, ViewTransition } from "react";
import { Tabs } from "@/components/Tabs";

// Rows are rendered on the server; this only filters them.
type Item = { slug: string; tags: string[]; row: React.ReactNode };

// "UK economy" -> "uk-economy", for tab ids.
const toId = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * Every essay, newest first, with tag filters. The filters only appear once there are two or more
 * essays: with one, there is nothing to filter. Rows move with named view transitions.
 */
export function EssayList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState("all");
  const tags = [...new Set(items.flatMap((item) => item.tags))];
  const filtering = items.length > 1;
  const shown = items.filter(
    (item) => filter === "all" || item.tags.some((tag) => toId(tag) === filter),
  );

  return (
    <>
      {filtering && (
        <Tabs
          className="mt-10"
          label="Filter essays by tag"
          idPrefix="essays"
          items={[
            { id: "all", label: "All" },
            ...tags.map((tag) => ({ id: toId(tag), label: tag })),
          ]}
          value={filter}
          onChange={(id) => startTransition(() => setFilter(id))}
        />
      )}
      <ul
        id="essays-panel"
        role={filtering ? "tabpanel" : undefined}
        aria-labelledby={filtering ? `essays-tab-${filter}` : undefined}
        className="mt-12 space-y-4"
      >
        {shown.map((item) => (
          <ViewTransition key={item.slug} name={`essay-${item.slug}`}>
            <li>{item.row}</li>
          </ViewTransition>
        ))}
      </ul>
    </>
  );
}
