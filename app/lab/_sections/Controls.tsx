"use client";

import { useState } from "react";
import { Chip, StatusChip } from "@/components/Chip";
import { ProgressBar } from "@/components/ProgressBar";
import { Tabs } from "@/components/Tabs";
import { Tooltip } from "@/components/Tooltip";
import { Card } from "@/components/Card";
import { keepRangesTogether } from "@/lib/typography";
import { Label } from "./LabSection";

const ledgerTabs = [
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
];

function TooltipDot({ id, text, open }: { id: string; text: string; open?: boolean }) {
  return (
    <Tooltip id={id} content={text} open={open}>
      <button
        type="button"
        aria-label={text}
        aria-describedby={id}
        className="inline-flex size-11 items-center justify-center rounded-full"
      >
        <span className="size-3 rounded-full bg-gilt ring-2 ring-paper" />
      </button>
    </Tooltip>
  );
}

// Chips, the Ledger toggle with a live tab indicator, the progress bar and tooltips.
export function Controls() {
  const [tab, setTab] = useState("open");

  return (
    <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
      <div className="space-y-8">
        <div>
          <Label>Tags</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip>UK economy</Chip>
            <Chip>Gilts</Chip>
            <Chip>Budget</Chip>
          </div>
        </div>
        <div>
          <Label>Prediction status. The word carries the meaning, the dot backs it up.</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusChip status="open" />
            <StatusChip status="right" />
            <StatusChip status="wrong" />
            <StatusChip status="void" />
          </div>
        </div>
        <div>
          <Label>Tooltip, shown on hover and keyboard focus. The second one is live.</Label>
          <div className="mt-12 flex gap-16 pl-28">
            <TooltipDot id="tip-a" text="2031–32: 4.2% of GDP, forecast" open />
            <TooltipDot id="tip-b" text="2022–23: 4.2% of GDP" />
          </div>
        </div>
      </div>

      <div>
        <Label>Toggle with a sliding indicator. Use the arrow keys once focused.</Label>
        <Tabs
          className="mt-3"
          label="Predictions"
          idPrefix="lab-ledger"
          items={ledgerTabs}
          value={tab}
          onChange={setTab}
        />
        <Card elevation="e1" className="mt-4 p-6">
          <div role="tabpanel" id="lab-ledger-panel" aria-labelledby={`lab-ledger-tab-${tab}`}>
            {tab === "open" ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-small text-muted">No. 001</p>
                  <StatusChip status="open" />
                </div>
                <p className="mt-3 text-lead">
                  {keepRangesTogether(
                    "Linkers will make up less than 9.3% of planned gilt sales in the 2027–28 remit.",
                  )}
                </p>
                <ProgressBar className="mt-6" made="2026-11-03" checkDate="2027-04-30" />
              </>
            ) : (
              <p className="text-slate">
                Nothing resolved yet. The first prediction is checked on 30 April 2027.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
