import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Headline options", robots: { index: false } };

// The three headline options from 04-content.md, each in the real hero, for Padraig to choose.
export default function HeadlineOptions() {
  const { hero } = getSite();
  return (
    <main>
      {hero.headlineOptions.map((headline, i) => (
        <div key={headline} className="relative">
          <p className="absolute top-4 right-4 z-20 rounded-pill bg-paper px-4 py-2 text-small font-semibold text-ink shadow-e3">
            Option {"ABC"[i]}
            {headline === hero.headline ? ", currently in use" : ""}
          </p>
          <Hero
            headline={headline}
            subline={hero.subline}
            primary={hero.primaryButton}
            secondary={hero.secondaryButton}
            latestEssay="/writing/the-bill-britain-keeps-signing"
          />
        </div>
      ))}
    </main>
  );
}
