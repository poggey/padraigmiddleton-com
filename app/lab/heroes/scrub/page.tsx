import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CurveScrubber } from "@/components/CurveScrubber";
import { Nav } from "@/components/Nav";
import { Actions, Headline, Subline } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: scrub", robots: { index: false } };

// Option 3: one large, real yield curve that replays the last 60 days and can be scrubbed.
export default function ScrubHero() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <Nav />
        <Container className="grid gap-16 py-14 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20 lg:py-16">
          <div>
            <Headline size="title" />
            <Subline className="mt-6" />
            <Actions className="mt-10" />
          </div>
          <div className="pl-12">
            <CurveScrubber />
            <p className="mt-6 text-small text-muted">
              UK nominal gilt yield curve, 6 months to 30 years. Source: Bank of England.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
