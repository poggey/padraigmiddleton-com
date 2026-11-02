import Link from "next/link";
import type { ProjectItem } from "./items";

/**
 * The projects as a grid of even cards: every graphic in the same frame, the words beneath, the
 * status at the foot. Each card is one link.
 */
export function ProjectCards({ items, heading = 3 }: { items: ProjectItem[]; heading?: 2 | 3 }) {
  const Heading = heading === 2 ? "h2" : "h3";
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.slug}>
          <article className="group relative flex h-full flex-col rounded-card bg-night-raised shadow-[inset_0_0_0_1px_var(--night-line)] transition-shadow duration-(--dur-hover) ease-out is-hover:shadow-[inset_0_0_0_1px_var(--night-line-strong)]">
            <div className="flex aspect-[16/11] items-center border-b border-night-line px-6">
              <div className="w-full">{item.graphic}</div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-small text-night-muted">{item.kind}</p>
              <Heading className="mt-1 text-h3 text-night-text">
                <Link
                  href={item.href}
                  className="rounded-[4px] after:absolute after:inset-0 after:rounded-[inherit]"
                >
                  {item.title}
                </Link>
              </Heading>
              <p className="mt-3 text-night-muted">{item.oneLine}</p>
              {item.keyResult && (
                <p className="mt-5 flex items-baseline gap-3">
                  <span className="text-h3 text-gilt">{item.keyResult.figure}</span>
                  <span className="text-small text-night-muted">{item.keyResult.label}</span>
                </p>
              )}
              <p className="mt-auto pt-6 text-small text-night-muted">
                <span className="font-semibold text-night-text">{item.status}.</span> {item.year}
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
