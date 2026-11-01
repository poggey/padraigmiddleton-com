import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Lens } from "@/components/Lens";
import { Nav } from "@/components/Nav";
import { Actions, Subline } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: lens", robots: { index: false } };

// Option: a glass lens follows the cursor over a large headline and magnifies it.
export default function LensHero() {
  return (
    <main>
      <section data-tone="night" className="night-band flex min-h-[46rem] flex-col lg:min-h-svh">
        <Nav tone="night" />
        <Container className="flex flex-1 flex-col justify-center py-16">
          <Lens
            text="Economics and markets, argued in writing and tested in code."
            className="max-w-[52rem]"
          />
          <Subline tone="night" className="mt-10" />
          <Actions tone="night" className="mt-10" />
        </Container>
      </section>
    </main>
  );
}
