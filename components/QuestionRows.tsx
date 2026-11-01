import Link from "next/link";
import { cx } from "@/lib/cx";

export type Question = { question: string; project: string; href: string };

/**
 * Rows of large questions drifting across the page at different speeds and directions. Hovering
 * a row stops it and lights it; each row links to the project that answers it. Under reduced
 * motion the rows stay still.
 */
export function QuestionRows({
  questions,
  className,
}: {
  questions: Question[];
  className?: string;
}) {
  return (
    <ul className={cx("space-y-3 md:space-y-5", className)}>
      {questions.map((q, i) => (
        <li key={q.href} className="group overflow-hidden">
          <Link href={q.href} className="block outline-offset-[-2px]">
            <span className="sr-only">
              {q.question} {q.project}.
            </span>
            <span
              aria-hidden
              className={cx(
                "flex w-max animate-[marquee_linear_infinite] [animation-duration:var(--duration)]",
                "group-hover:[animation-play-state:paused] group-focus-visible:[animation-play-state:paused] reduced:animate-none",
                i % 2 === 1 && "[animation-direction:reverse]",
              )}
              style={{ "--duration": `${64 + i * 14}s` } as React.CSSProperties}
            >
              {[0, 1, 2, 3].map((copy) => (
                <span
                  key={copy}
                  className="flex items-baseline gap-6 pr-16 whitespace-nowrap md:gap-8 md:pr-24"
                >
                  <span className="text-title text-ink transition-colors duration-(--dur-hover) ease-out group-hover:text-signal">
                    {q.question}
                  </span>
                  <span className="text-small font-semibold text-muted">{q.project}</span>
                </span>
              ))}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
