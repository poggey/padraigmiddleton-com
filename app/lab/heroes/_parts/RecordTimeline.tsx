"use client";

import { useToday } from "@/lib/useToday";

const DAY = 24 * 60 * 60 * 1000;
const format = (d: Date) =>
  d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

// A wide gold timeline from the day a prediction was made to the day it is checked.
export function RecordTimeline({
  made,
  check,
  className,
}: {
  made: string;
  check: string;
  className?: string;
}) {
  const today = useToday();
  const start = new Date(made);
  const end = new Date(check);
  const now = today ?? start;
  const fraction = Math.min(
    1,
    Math.max(0, (now.getTime() - start.getTime()) / (end.getTime() - start.getTime())),
  );
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / DAY));

  // Month boundaries between the two dates, as ticks along the bar.
  const months: { label: string; at: number }[] = [];
  for (
    let m = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
    m < end;
    m = new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth() + 1, 1))
  ) {
    months.push({
      label: m.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }),
      at: (m.getTime() - start.getTime()) / (end.getTime() - start.getTime()),
    });
  }

  return (
    <div className={className}>
      <p className="text-h3 tabular-nums">{today ? `${daysLeft} days to go` : " "}</p>
      <div className="relative mt-5 h-2.5 rounded-pill bg-line">
        <div
          className="h-full rounded-pill bg-gilt transition-[width] duration-(--dur-reveal) ease-out"
          style={{ width: `${fraction * 100}%` }}
        />
        {months.map((m) => (
          <span
            key={m.label}
            aria-hidden
            className="absolute top-0 h-full w-px bg-paper"
            style={{ left: `${m.at * 100}%` }}
          >
            <span className="absolute top-5 -translate-x-1/2 text-small text-muted">{m.label}</span>
          </span>
        ))}
      </div>
      <div className="mt-12 flex justify-between gap-6 text-small">
        <span>
          <span className="text-muted">Made </span>
          {format(start)}
        </span>
        <span className="text-right">
          <span className="text-muted">Checked </span>
          {format(end)}
        </span>
      </div>
    </div>
  );
}
