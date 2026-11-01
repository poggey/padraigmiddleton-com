import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { GiltSlice } from "@/components/GiltSlice";
import { Nav } from "@/components/Nav";
import { Actions, Headline, Subline, latestClose } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: slice", robots: { index: false } };

// Option C: a plane of flowing colour whose top edge is today's yield curve.
export default function SliceHero() {
  return (
    <main>
      <section className="relative flex min-h-[48rem] flex-col overflow-hidden lg:min-h-svh">
        <GiltSlice className="absolute inset-0 hidden lg:block" />
        <GiltSlice className="absolute inset-0 lg:hidden" start={0} low={0.14} high={0.32} />
        <div className="relative">
          <Nav />
        </div>
        <Container className="relative flex-1 pt-14 lg:pt-20">
          <div className="max-w-[44rem]">
            <Headline />
            <Subline className="mt-6" />
            <Actions className="mt-10" />
          </div>
        </Container>
        <Container className="relative pb-6">
          <p
            data-tone="night"
            className="max-w-[40ch] text-small text-night-text/85 lg:ml-auto lg:text-right"
          >
            The edge is the UK gilt yield curve at the latest close, {latestClose}, from 6 months to
            30 years. Faint lines above: the eight weeks before. Source: Bank of England.
          </p>
        </Container>
      </section>
    </main>
  );
}
