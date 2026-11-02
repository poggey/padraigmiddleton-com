"use client";

import { startTransition, useState, ViewTransition } from "react";
import { Tabs } from "@/components/Tabs";
import { cx } from "@/lib/cx";

// Tiles are rendered on the server; feature tiles come with their graphic on the side.
type Item = { slug: string; group: string; size: "feature" | "standard"; tile: React.ReactNode };

const filters = [
  { id: "all", label: "All" },
  { id: "markets", label: "Markets" },
  { id: "data", label: "Data" },
  { id: "systems", label: "Systems" },
];

/**
 * Every project with filter tabs. Each tile is a named view transition: tiles that stay slide to
 * their new place, tiles that leave or arrive fade. The tiles are rendered on the server.
 */
export function ProjectsGrid({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState("all");
  const shown = items.filter((item) => filter === "all" || item.group === filter);

  return (
    <>
      <Tabs
        className="mt-10"
        tone="night"
        label="Filter projects"
        idPrefix="projects"
        items={filters}
        value={filter}
        onChange={(id) => startTransition(() => setFilter(id))}
      />
      <ul
        id="projects-panel"
        role="tabpanel"
        aria-labelledby={`projects-tab-${filter}`}
        className="mt-8 grid grid-flow-row-dense gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        {shown.map((item) => (
          <ViewTransition key={item.slug} name={`project-${item.slug}`}>
            <li className={cx(item.size === "feature" && "md:col-span-2")}>{item.tile}</li>
          </ViewTransition>
        ))}
      </ul>
    </>
  );
}
