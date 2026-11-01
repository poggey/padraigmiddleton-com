import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata: Metadata = { title: "Hero options", robots: { index: false } };

const options = [
  {
    href: "/lab/heroes/ribbon",
    name: "1. Ribbon",
    text: "The gilt-curve ribbon sweeps up the right-hand side. The headline has the left to itself.",
  },
  {
    href: "/lab/heroes/horizon",
    name: "2. Horizon",
    text: "The ribbon runs edge to edge across the lower half, like a landscape, with the headline above.",
  },
  {
    href: "/lab/heroes/scrub",
    name: "3. Scrub",
    text: "One large, real yield curve replays the last 60 days on load and settles on the latest close. Drag the timeline to travel through them.",
  },
  {
    href: "/lab/heroes/record",
    name: "4. On the record",
    text: "Typography first. The live prediction is the headline, with a gold timeline counting down to the day it is checked.",
  },
];

export default function HeroOptions() {
  return (
    <main>
      <Container className="py-20">
        <h1 className="text-h2">Hero options</h1>
        <p className="mt-3 max-w-[60ch] text-lead text-slate">
          Four directions, all built from real data. Open each one full screen.
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
