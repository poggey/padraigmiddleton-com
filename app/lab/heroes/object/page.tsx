import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { GiltSurface } from "@/components/GiltSurface";
import { Nav } from "@/components/Nav";
import { Actions, Headline, Subline, firstWeek, latestClose } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: object", robots: { index: false } };

// Option A: the yield curve as a sculpted object on a clean stage, like a product shot.
export default function ObjectHero() {
  return (
    <main>
      <section className="relative flex min-h-[46rem] flex-col overflow-hidden lg:min-h-svh">
        <Nav />
        <Container className="grid flex-1 items-center gap-6 py-10 lg:grid-cols-[0.9fr_1.3fr] lg:gap-0">
          <div className="relative z-10">
            <Headline size="title" />
            <Subline className="mt-6" />
            <Actions className="mt-10" />
          </div>
          <div className="relative -mx-(--gutter) h-[22rem] lg:mx-0 lg:-mr-24 lg:h-[min(72svh,44rem)]">
            <div
              aria-hidden
              className="absolute inset-x-[16%] bottom-[14%] h-16 rounded-[50%] bg-ink/20 blur-3xl"
            />
            <GiltSurface className="absolute inset-0 size-full" />
          </div>
        </Container>
        <Container className="pb-8">
          <p className="max-w-[64ch] text-small text-muted">
            UK gilt yield curves every week from {firstWeek} to {latestClose}, each averaged with
            the weeks either side: maturity from 6 months to 30 years across, time from back to
            front, yield as height. The gold edge is the latest close, unsmoothed. Source: Bank of
            England.
          </p>
        </Container>
      </section>
    </main>
  );
}
