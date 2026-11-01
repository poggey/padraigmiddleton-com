import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata: Metadata = { title: "Hero options", robots: { index: false } };

const options = [
  {
    href: "/lab/heroes/object",
    name: "A. Object",
    text: "The yield curve as a sculpted object on a clean stage, lit like a product shot. Nearly two years of weekly gilt curves form a solid surface that rises on load, turns slowly and leans towards the cursor. The latest close is its gold front edge.",
  },
  {
    href: "/lab/heroes/constellation",
    name: "B. Constellation",
    text: "The same two years as thousands of points of light on night blue, a slowly turning cloud with the latest close picked out in gold. The dark option.",
  },
  {
    href: "/lab/heroes/slice",
    name: "C. Slice",
    text: "A plane of slowly flowing colour fills the lower right of the page, and its top edge is today's yield curve, drawn in gold. Faint lines above show where the edge was in the weeks before. The cursor lights the colour.",
  },
];

export default function HeroOptions() {
  return (
    <main>
      <Container className="py-20">
        <h1 className="text-h2">Hero options</h1>
        <p className="mt-3 max-w-[60ch] text-lead text-slate">
          Three directions, each built from real Bank of England data. Open each one full screen.
        </p>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {options.map((o) => (
            <li key={o.href}>
              <Link
                href={o.href}
                className="block h-full rounded-card bg-paper p-6 shadow-e1 transition-[box-shadow,translate] duration-(--dur-hover) ease-out is-hover:-translate-y-0.5 is-hover:shadow-e2"
              >
                <span className="text-h3">{o.name}</span>
                <span className="mt-2 block text-slate">{o.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
