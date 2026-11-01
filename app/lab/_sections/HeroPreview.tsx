import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GiltRibbon } from "@/components/GiltRibbon";
import { GlassPanel } from "@/components/GlassPanel";
import { Nav } from "@/components/Nav";
import gilts from "@/public/data/gilt-curves.json";

const latest = new Date(gilts.asOf).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// A first composition of the homepage hero around the ribbon. Cards are static for now.
export function HeroPreview() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-line"
    >
      <GiltRibbon className="absolute inset-0 size-full opacity-35 lg:opacity-100" />
      <div className="relative">
        <Nav />
      </div>
      <Container className="relative grid min-h-[40rem] gap-12 pt-16 pb-28 lg:min-h-[46rem] lg:grid-cols-[1.45fr_1fr] lg:pt-24">
        <div>
          <h2 id="hero-heading" className="text-display">
            Economics and markets, argued in writing and tested in code.
          </h2>
          <p className="mt-6 max-w-[34ch] text-lead text-slate">
            Second-year Economics and Finance student at Queen Mary University of London. Looking
            for Summer 2027 internships.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/writing/the-bill-britain-keeps-signing">Read the latest essay</Button>
            <Button variant="secondary" href="#projects-heading">
              See the projects
            </Button>
          </div>
        </div>

        <div className="relative min-h-[22rem] lg:mt-24">
          <GlassPanel className="relative z-10 w-[min(100%,20rem)] p-6 pb-12 lg:ml-auto">
            <p className="text-stat">£15bn</p>
            <p className="mt-2 text-small text-slate">
              added to this year’s debt interest before a single Budget measure was counted
            </p>
            <p className="mt-4 text-small text-muted">From No. 1: The bill Britain keeps signing</p>
          </GlassPanel>
          <div
            data-tone="night"
            className="relative z-20 -mt-6 ml-6 w-[min(100%-1.5rem,21rem)] rounded-card bg-night p-6 shadow-e3 lg:ml-[6%]"
          >
            <p className="text-small font-semibold text-gilt">On the record</p>
            <p className="mt-2 text-ui text-night-text">
              Linkers will make up less than 9.3% of planned gilt sales in the 2027{"⁠–⁠"}28 remit.
            </p>
            <p className="mt-4 text-small text-night-muted">Open. Checked 30 April 2027.</p>
          </div>
        </div>
      </Container>
      <Container className="relative">
        <p className="absolute bottom-6 max-w-[60ch] text-small text-muted">
          UK government bond yield curves, 6 months to 30 years, over the last 60 trading days. The
          latest close, {latest}, is in gold. Source: Bank of England.
        </p>
      </Container>
    </section>
  );
}
