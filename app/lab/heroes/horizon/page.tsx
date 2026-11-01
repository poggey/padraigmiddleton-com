import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { GiltRibbon } from "@/components/GiltRibbon";
import { Nav } from "@/components/Nav";
import { Actions, CurveCaption, Headline, Subline } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: horizon", robots: { index: false } };

// Option 2: the ribbon runs edge to edge across the lower half, like a landscape.
export default function HorizonHero() {
  return (
    <main>
      <section className="relative flex min-h-[44rem] flex-col overflow-hidden lg:min-h-svh">
        <GiltRibbon
          layout="horizon"
          className="absolute inset-0 size-full opacity-35 lg:opacity-100"
        />
        <div className="relative">
          <Nav />
        </div>
        <Container className="relative grid w-full gap-8 pt-14 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16 lg:pt-20">
          <Headline />
          <div className="lg:pb-2">
            <Subline />
            <Actions className="mt-8" />
            <CurveCaption className="mt-8 hidden lg:block" />
          </div>
        </Container>
        <div className="flex-1" />
        <Container className="relative w-full pb-8 lg:hidden">
          <CurveCaption />
        </Container>
      </section>
    </main>
  );
}
