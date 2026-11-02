import data from "@/public/data/projects/stirling.json";
import { formatDate } from "@/lib/format";
import { cx } from "@/lib/cx";
import type { Variant } from "./frame";

// The three latest weekday editions as a stack: the newest in front, the two before it peeking
// out above as edges. Headlines exactly as published.
export function StirlingGraphic({ variant }: { variant: Variant }) {
  const page = variant === "page";
  const step = page ? 18 : 12;
  const [latest, ...older] = data.editions;
  return (
    <div
      role="img"
      aria-label={`The latest Stirling editions: ${data.editions.map((e) => `No. ${e.number}, ${formatDate(e.date)}: ${e.headline}`).join("; ")}.`}
      className="relative"
      style={{ paddingTop: older.length * step }}
    >
      {older.map((edition, i) => {
        const depth = older.length - i;
        return (
          <div
            key={edition.number}
            aria-hidden
            data-fade
            style={
              {
                "--after": 0.2 * (older.length - depth),
                top: (older.length - depth) * step,
                left: depth * step,
                right: depth * step,
              } as React.CSSProperties
            }
            className="absolute bottom-0 rounded-inline bg-night shadow-[inset_0_0_0_1px_var(--night-line-strong)]"
          />
        );
      })}
      <div
        data-fade
        style={{ "--after": 0.5 } as React.CSSProperties}
        className={cx(
          "relative rounded-inline bg-night shadow-[inset_0_0_0_1px_var(--night-line-strong)]",
          page ? "p-6" : "p-4",
        )}
      >
        <p className="text-small text-night-muted">
          No. {latest.number}, {formatDate(latest.date)}
        </p>
        <p
          className={cx(
            "mt-2 font-serif text-night-text",
            page ? "text-essay-dek" : "text-lead leading-snug",
          )}
        >
          {latest.headline}
        </p>
        <p className="mt-3 text-small text-night-muted">Story of the Day</p>
      </div>
    </div>
  );
}
