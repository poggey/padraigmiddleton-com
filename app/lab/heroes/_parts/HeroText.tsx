import { Button } from "@/components/Button";
import { cx } from "@/lib/cx";
import surface from "@/public/data/gilt-surface.json";

// Shared copy for the hero options, from 04-content.md (headline option B).

type Tone = "light" | "night";

export function Headline({
  className,
  size = "display",
}: {
  className?: string;
  size?: "display" | "title";
}) {
  return (
    <h1 className={cx(size === "display" ? "text-display" : "text-title", className)}>
      Economics and markets, argued in writing and tested in code.
    </h1>
  );
}

export function Subline({ className, tone = "light" }: { className?: string; tone?: Tone }) {
  return (
    <p
      className={cx(
        "max-w-[34ch] text-lead",
        tone === "light" ? "text-slate" : "text-night-muted",
        className,
      )}
    >
      Second-year Economics and Finance student at Queen Mary University of London. Looking for
      Summer 2027 internships.
    </p>
  );
}

export function Actions({ className, tone = "light" }: { className?: string; tone?: Tone }) {
  return (
    <div className={cx("flex flex-wrap gap-3", className)}>
      <Button tone={tone} href="/writing/the-bill-britain-keeps-signing">
        Read the latest essay
      </Button>
      <Button tone={tone} variant="secondary" href="/projects">
        See the projects
      </Button>
    </div>
  );
}

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export const latestClose = date(surface.asOf);
export const firstWeek = date(surface.curves[0].date);
