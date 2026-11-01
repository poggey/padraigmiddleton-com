import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { Torch } from "@/components/Torch";
import { essayParagraphs } from "@/lib/essayText";
import { Actions, Headline, Subline } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: torch", robots: { index: false } };

const essay = essayParagraphs("the-bill-britain-keeps-signing.mdx");

// Option: the essay is hidden beneath the page; the cursor is a light that reveals it.
export default function TorchHero() {
  return (
    <main>
      <section data-tone="night" className="bg-night">
        <Torch paragraphs={essay} className="flex min-h-[46rem] flex-col lg:min-h-svh">
          <Nav tone="night" />
          <Container className="flex min-h-[40rem] flex-col justify-center py-16 lg:min-h-[calc(100svh-4rem)]">
            <div className="max-w-[46rem]">
              <Headline className="text-night-text" />
              <Subline tone="night" className="mt-6" />
              <Actions tone="night" className="mt-10" />
              <p className="mt-16 text-small text-night-muted">
                Underneath: No. 1, The bill Britain keeps signing.
              </p>
            </div>
          </Container>
        </Torch>
      </section>
    </main>
  );
}
