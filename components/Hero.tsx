import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GiltRibbon } from "@/components/GiltRibbon";
import { GiltRibbonStatic } from "@/components/GiltRibbonStatic";
import { formatDate } from "@/lib/format";
import gilts from "@/public/data/gilt-curves.json";

// The homepage hero: night ground, the gilt-curve ribbon, headline, subline and two buttons.
// Phase 5 finishes it (load sequence, gold-curve tooltip, measurements).
export function Hero({
  headline,
  subline,
  primary,
  secondary,
  latestEssay,
}: {
  headline: string;
  subline: string;
  primary: string;
  secondary: string;
  latestEssay: string;
}) {
  return (
    <section
      data-tone="night"
      data-nav-tone="night"
      aria-labelledby="hero-heading"
      className="night-band relative flex min-h-[46rem] flex-col overflow-hidden pt-16 lg:min-h-svh"
    >
      <GiltRibbon
        layout="side"
        tone="night"
        className="absolute inset-0 size-full opacity-25 lg:opacity-100"
      />
      <noscript>
        <GiltRibbonStatic />
      </noscript>
      <Container className="relative flex flex-1 items-center py-16">
        <div className="max-w-[44rem]">
          <h1 id="hero-heading" className="text-display text-night-text">
            {headline}
          </h1>
          <p className="mt-6 max-w-[34ch] text-lead text-night-muted">{subline}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button tone="night" href={latestEssay}>
              {primary}
            </Button>
            <Button tone="night" variant="secondary" href="/projects">
              {secondary}
            </Button>
          </div>
        </div>
      </Container>
      <Container className="relative pb-8">
        <p className="max-w-[60ch] text-small text-night-muted">
          UK government bond yield curves, 6 months to 30 years, over the last 60 trading days. The
          latest close, {formatDate(gilts.asOf)}, is in gold. Source: Bank of England.
        </p>
      </Container>
    </section>
  );
}
