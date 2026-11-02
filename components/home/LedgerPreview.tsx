"use client";

import Link from "next/link";
import { startTransition, useState, ViewTransition } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatusChip } from "@/components/Chip";
import { ProgressBar } from "@/components/ProgressBar";
import { Tabs } from "@/components/Tabs";
import type { Prediction } from "@/lib/content/schemas";
import { keepRangesTogether } from "@/lib/typography";

type Entry = Prediction & { essayTitle: string; essayNumber: number };

// The Ledger on the homepage: the idea on the left, the open and resolved predictions on the right.
export function LedgerPreview({
  entries,
  record,
  copy,
}: {
  entries: Entry[];
  record: string;
  copy: { heading: string; copy: string; emptyResolved: string };
}) {
  const [tab, setTab] = useState("open");
  const open = entries.filter((e) => e.status === "open");
  const resolved = entries.filter((e) => e.status !== "open");
  const shown = tab === "open" ? open : resolved;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
      <div>
        <h2 id="ledger-heading" className="text-h2">
          {copy.heading}
        </h2>
        <p className="mt-4 max-w-[46ch] text-lead text-slate">{copy.copy}</p>
        <p className="mt-6 text-ui font-medium text-ink">{record}</p>
        <Button variant="secondary" href="/ledger" className="mt-8">
          See the Ledger
        </Button>
      </div>

      <Card elevation="e2" className="p-6 md:p-8">
        <Tabs
          label="Predictions"
          idPrefix="ledger"
          items={[
            { id: "open", label: `Open (${open.length})` },
            { id: "resolved", label: `Resolved (${resolved.length})` },
          ]}
          value={tab}
          onChange={(id) => startTransition(() => setTab(id))}
        />
        <ViewTransition key={tab} name="ledger-panel" share="auto" enter="auto" default="none">
          <div
            id="ledger-panel"
            role="tabpanel"
            aria-labelledby={`ledger-tab-${tab}`}
            className="mt-6"
          >
            {shown.length === 0 ? (
              <p className="text-slate">{copy.emptyResolved}</p>
            ) : (
              <ul className="divide-y divide-line">
                {shown.map((entry) => (
                  <li key={entry.id} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-small text-muted">No. {entry.id}</p>
                      <StatusChip status={entry.status} />
                    </div>
                    <p className="mt-3 text-lead text-ink">{keepRangesTogether(entry.claim)}</p>
                    <p className="mt-2 text-small text-muted">
                      From{" "}
                      <Link
                        href={`/writing/${entry.essaySlug}`}
                        className="text-signal underline decoration-signal/35 underline-offset-4 is-hover:decoration-signal"
                      >
                        No. {entry.essayNumber}, {entry.essayTitle}
                      </Link>
                    </p>
                    {entry.status === "open" ? (
                      <ProgressBar className="mt-5" made={entry.made} checkDate={entry.checkDate} />
                    ) : (
                      entry.outcome && <p className="mt-3 text-slate">{entry.outcome}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ViewTransition>
      </Card>
    </div>
  );
}
