import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { QuestionRows } from "@/components/QuestionRows";
import { Actions } from "../_parts/HeroText";

export const metadata: Metadata = { title: "Hero: questions", robots: { index: false } };

// The questions each project set out to answer, from 04-content.md.
const questions = [
  { question: "Great driver or great car?", project: "APEX", href: "/projects/apex" },
  {
    question: "Is a film studio’s slate more like a balanced portfolio or a venture fund?",
    project: "The Slate",
    href: "/projects/the-slate",
  },
  {
    question: "How far does textbook portfolio theory get you with real data?",
    project: "Portfolio Optimiser",
    href: "/projects/portfolio-optimiser",
  },
  {
    question:
      "Once you’ve built a portfolio, how do you measure its risk, and how do you test it against a crisis?",
    project: "Portfolio Risk Dashboard",
    href: "/projects/risk-dashboard",
  },
];

// Option: lead with curiosity. The questions drift across the page in large type.
export default function QuestionsHero() {
  return (
    <main>
      <section className="flex min-h-[46rem] flex-col overflow-hidden lg:min-h-svh">
        <Nav />
        <Container className="pt-16 lg:pt-20">
          <h1 className="max-w-[24ch] text-h2">
            Questions I wanted answered, so I built something to answer them.
          </h1>
        </Container>
        <QuestionRows questions={questions} className="mt-12 flex-1 lg:mt-16" />
        <Container className="mt-12 flex flex-col justify-between gap-8 pb-10 lg:flex-row lg:items-end">
          <p className="max-w-[46ch] text-slate">
            <span className="font-semibold text-ink">Padraig Middleton.</span> Second-year Economics
            and Finance student at Queen Mary University of London. Looking for Summer 2027
            internships.
          </p>
          <Actions />
        </Container>
      </section>
    </main>
  );
}
