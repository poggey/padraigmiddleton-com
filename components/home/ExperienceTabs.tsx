"use client";

import { startTransition, useState, ViewTransition } from "react";
import { Tabs } from "@/components/Tabs";
import type { Experience } from "@/lib/content/schemas";

type Role = Experience["roles"][number];

// Roles as a vertical list of tabs; the selected role's detail cross-fades in beside it.
export function ExperienceTabs({ roles }: { roles: Role[] }) {
  const [active, setActive] = useState(roles[0].id);
  const role = roles.find((r) => r.id === active) ?? roles[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-8">
      <Tabs
        label="Roles"
        idPrefix="experience"
        orientation="vertical"
        value={active}
        onChange={(id) => startTransition(() => setActive(id))}
        items={roles.map((r) => ({
          id: r.id,
          label: (
            <>
              <span className="block text-ui font-semibold">{r.organisation}</span>
              <span className="mt-0.5 block text-small font-normal text-muted">{r.dates}</span>
            </>
          ),
        }))}
      />
      <ViewTransition
        key={role.id}
        name="experience-panel"
        share="auto"
        enter="auto"
        default="none"
      >
        <div
          id="experience-panel"
          role="tabpanel"
          aria-labelledby={`experience-tab-${role.id}`}
          className="rounded-card bg-paper p-6 shadow-e1 md:p-8"
        >
          <h3 className="text-h3">{role.organisation}</h3>
          <p className="mt-1 text-slate">
            {role.role}, {role.location}. {role.dates}.
          </p>
          <ul className="mt-6 space-y-3">
            {role.bullets.map((bullet) => (
              <li key={bullet} className="relative max-w-[62ch] pl-5 text-ink">
                <span
                  aria-hidden
                  className="absolute top-[0.65em] left-0 h-px w-2.5 bg-line-strong"
                />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </ViewTransition>
    </div>
  );
}
