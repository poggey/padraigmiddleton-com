import type { MDXComponents } from "mdx/types";
import { EssayChart } from "@/components/essay/EssayChart";
import { Figure } from "@/components/essay/Figure";
import { HeadroomSlider } from "@/components/essay/HeadroomSlider";
import { Prediction } from "@/components/essay/Prediction";
import { PullQuote } from "@/components/essay/PullQuote";
import { Sidenote } from "@/components/essay/Sidenote";
import { Sources } from "@/components/essay/Sources";
import { WhereIMightBeWrong } from "@/components/essay/WhereIMightBeWrong";

// How an essay's Markdown is styled, and the components an essay can use.
export const essayComponents: MDXComponents = {
  p: (props) => <p className="mt-7 font-serif text-essay-body first:mt-0" {...props} />,
  a: ({ href = "", children, ...props }) => (
    <a
      href={href}
      className="rounded-[2px] text-signal underline decoration-signal/35 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-(--dur-hover) is-hover:decoration-signal"
      {...props}
    >
      {children}
      {/^https?:/.test(href) && <span aria-hidden>{" "}↗</span>}
    </a>
  ),
  Chart: EssayChart,
  Figure,
  HeadroomSlider,
  Prediction,
  PullQuote,
  Sidenote,
  Sources,
  WhereIMightBeWrong,
};
