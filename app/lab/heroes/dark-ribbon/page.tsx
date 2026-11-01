import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { GiltRibbon } from "@/components/GiltRibbon";
import { Nav } from "@/components/Nav";
import { Actions, Headline, Subline, latestClose } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: dark ribbon", robots: { index: false } };

// Padraig's pick from round two: the ribbon, on the night ground of the constellation.
export default function DarkRibbonHero() {
  return (
    <main>
      <section
        data-tone="night"
        className="night-band relative flex min-h-[46rem] flex-col overflow-hidden lg:min-h-svh"
      >
        <GiltRibbon
          layout="side"
          tone="night"
          className="absolute inset-0 size-full opacity-25 lg:opacity-100"
        />
        <div className="relative">
          <Nav tone="night" />
        </div>
        <Container className="relative flex flex-1 items-center py-16">
          <div className="max-w-[44rem]">
            <Headline className="text-night-text" />
            <Subline tone="night" className="mt-6" />
            <Actions tone="night" className="mt-10" />
          </div>
        </Container>
        <Container className="relative pb-8">
          <p className="max-w-[60ch] text-small text-night-muted">
            UK government bond yield curves, 6 months to 30 years, over the last 60 trading days.
            The latest close, {latestClose}, is in gold. Source: Bank of England.
          </p>
        </Container>
      </section>
    </main>
  );
}
