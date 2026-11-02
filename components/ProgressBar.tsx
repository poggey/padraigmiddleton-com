"use client";

import { cx } from "@/lib/cx";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { useToday } from "@/lib/useToday";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Time elapsed between the day a prediction was made and its check date, filled to today.
 * Today comes from the browser, so the bar is empty until the page has loaded.
 */
export function ProgressBar({
  made,
  checkDate,
  tone = "light",
  className,
}: {
  made: string;
  checkDate: string;
  tone?: "light" | "night";
  className?: string;
}) {
  const today = useToday();
  // The bar fills once it is on screen.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.6);
  const start = Date.parse(made);
  const end = Date.parse(checkDate);
  const now = today?.getTime() ?? start;
  const fraction = Math.min(1, Math.max(0, (now - start) / (end - start)));
  const daysLeft = Math.max(0, Math.ceil((end - now) / DAY));
  const text = !today ? "" : daysLeft === 0 ? "Due for checking" : `${daysLeft} days to go`;

  return (
    <div className={className}>
      <div
        ref={ref}
        role="progressbar"
        aria-label="Time until the check date"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(fraction * 100)}
        aria-valuetext={text || undefined}
        className={cx(
          "h-1.5 overflow-hidden rounded-pill",
          tone === "light" ? "bg-line" : "bg-night-line",
        )}
      >
        <div
          className="h-full rounded-pill bg-gilt transition-[width] duration-(--dur-reveal) ease-out"
          style={{ width: `${inView ? fraction * 100 : 0}%` }}
        />
      </div>
      <p
        className={cx(
          "mt-2 text-small tabular-nums",
          tone === "light" ? "text-muted" : "text-night-muted",
        )}
      >
        {/* A non-breaking space holds the line's height before the date is known. */}
        {text || "\u00a0"}
      </p>
    </div>
  );
}
