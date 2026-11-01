import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata: Metadata = { title: "Hero options", robots: { index: false } };

const options = [
  {
    href: "/lab/heroes/dark-ribbon",
    name: "Dark ribbon",
    text: "Your pick: the gilt-curve ribbon on the night ground, glowing where the curves overlap.",
  },
  {
    href: "/lab/heroes/torch",
    name: "Torch",
    text: "The first essay is hidden beneath the page. Your cursor is a light that reveals the writing as you move; on phones the light drifts on its own.",
  },
  {
    href: "/lab/heroes/lens",
    name: "Lens",
    text: "A huge headline with a piece of glass over it. The lens follows your cursor and magnifies the words, with a faint colour fringe at the rim.",
  },
  {
    href: "/lab/heroes/questions",
    name: "Questions",
    text: "Lead with curiosity: the questions your projects set out to answer drift across the page in large type. Hover one to stop it and open the project.",
  },
];

export default function HeroOptions() {
  return (
    <main>
      <Container className="py-20">
        <h1 className="text-h2">Hero options</h1>
        <p className="mt-3 max-w-[60ch] text-lead text-slate">
          Open each one full screen and move your cursor around.
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
