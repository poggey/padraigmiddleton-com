import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { GiltConstellation } from "@/components/GiltConstellation";
import { Nav } from "@/components/Nav";
import { Actions, Headline, Subline, firstWeek, latestClose } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: constellation", robots: { index: false } };

// Option B: the same surface as a slowly turning cloud of light on night blue.
export default function ConstellationHero() {
  return (
    <main>
      <section
        data-tone="night"
        className="night-band relative flex min-h-[46rem] flex-col overflow-hidden lg:min-h-svh"
      >
        <GiltConstellation className="absolute inset-x-0 bottom-0 h-[50%] w-full lg:inset-y-0 lg:right-auto lg:left-[30%] lg:h-full lg:w-[80%] lg:[mask-image:linear-gradient(to_right,transparent,black_30%)]" />
        <div className="relative">
          <Nav tone="night" />
        </div>
        <Container className="relative flex flex-1 items-center py-12">
          <div className="max-w-[40rem]">
            <Headline size="title" className="text-night-text" />
            <Subline tone="night" className="mt-6" />
            <Actions tone="night" className="mt-10" />
          </div>
        </Container>
        <Container className="relative pb-8 pt-[38svh] lg:pt-0">
          <p className="max-w-[64ch] text-small text-night-muted">
            Each point is a UK gilt yield: maturity from 6 months to 30 years across, weeks from{" "}
            {firstWeek} at the back to {latestClose} in gold at the front, yield as height. Source:
            Bank of England.
          </p>
        </Container>
      </section>
    </main>
  );
}
