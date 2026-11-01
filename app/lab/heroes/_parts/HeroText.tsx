import { Button } from "@/components/Button";
import gilts from "@/public/data/gilt-curves.json";

// Shared copy for the hero options, from 04-content.md (headline option B).

export function Headline({
  className,
  size = "display",
}: {
  className?: string;
  size?: "display" | "title";
}) {
  return (
    <h1 className={`${size === "display" ? "text-display" : "text-title"} ${className ?? ""}`}>
      Economics and markets, argued in writing and tested in code.
    </h1>
  );
}

export function Subline({ className }: { className?: string }) {
  return (
    <p className={`max-w-[34ch] text-lead text-slate ${className ?? ""}`}>
      Second-year Economics and Finance student at Queen Mary University of London. Looking for
      Summer 2027 internships.
    </p>
  );
}

export function Actions({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ""}`}>
      <Button href="/writing/the-bill-britain-keeps-signing">Read the latest essay</Button>
      <Button variant="secondary" href="/projects">
        See the projects
      </Button>
    </div>
  );
}

const latest = new Date(gilts.asOf).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function CurveCaption({ className }: { className?: string }) {
  return (
    <p className={`max-w-[60ch] text-small text-muted ${className ?? ""}`}>
      UK government bond yield curves, 6 months to 30 years, over the last 60 trading days. The
      latest close, {latest}, is in gold. Source: Bank of England.
    </p>
  );
}
