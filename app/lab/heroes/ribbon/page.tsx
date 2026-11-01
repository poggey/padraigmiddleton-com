import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { GiltRibbon } from "@/components/GiltRibbon";
import { Nav } from "@/components/Nav";
import { Actions, CurveCaption, Headline, Subline } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: ribbon", robots: { index: false } };

// Option 1: the ribbon sweeps up the right-hand side; the headline has the left to itself.
export default function RibbonHero() {
  return (
    <main>
      <section className="relative flex min-h-[44rem] flex-col overflow-hidden lg:min-h-svh">
        <GiltRibbon
          layout="side"
          className="absolute inset-0 size-full opacity-35 lg:opacity-100"
        />
        <div className="relative">
          <Nav />
        </div>
        <Container className="relative flex w-full flex-1 items-center py-16">
          <div className="max-w-[44rem]">
            <Headline />
            <Subline className="mt-6" />
            <Actions className="mt-10" />
          </div>
        </Container>
        <Container className="relative w-full pb-8">
          <CurveCaption />
        </Container>
      </section>
    </main>
  );
}
