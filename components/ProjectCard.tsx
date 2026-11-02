"use client";

import Link from "next/link";
import { useRef } from "react";
import { cx } from "@/lib/cx";
import styles from "./ProjectCard.module.css";

export type ProjectCardProps = {
  href: string;
  title: string;
  kind: string;
  oneLine: string;
  status: string;
  stack: string[];
  keyResult?: { figure: string; label: string };
  size: "feature" | "standard";
  /** Where the graphic sits on wide screens. */
  layout?: "top" | "side";
  graphic: React.ReactNode;
  todo?: string;
  className?: string;
};

const list = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });

// A project tile on the night band. The graphic shows the project's own output.
export function ProjectCard({
  href,
  title,
  kind,
  oneLine,
  status,
  stack,
  keyResult,
  size,
  layout = "top",
  graphic,
  todo,
  className,
}: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);

  // Moves the spotlight with the cursor without re-rendering.
  function onPointerMove(event: React.PointerEvent) {
    const card = ref.current;
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--x", `${event.clientX - box.left}px`);
    card.style.setProperty("--y", `${event.clientY - box.top}px`);
  }

  return (
    <article
      ref={ref}
      data-tone="night"
      onPointerMove={onPointerMove}
      className={cx(
        styles.card,
        "flex h-full flex-col bg-night-raised shadow-[inset_0_0_0_1px_var(--night-line)]",
        "transition-[translate] duration-(--dur-hover) ease-out is-hover:-translate-y-0.5",
        size === "feature" ? "rounded-feature" : "rounded-card",
        layout === "side" && "lg:flex-row",
        className,
      )}
    >
      <div
        className={cx(
          "px-5 pt-5 md:px-6 md:pt-6",
          layout === "side" && "lg:w-[56%] lg:shrink-0 lg:self-center lg:pb-6",
        )}
      >
        {graphic}
      </div>
      <div className="flex flex-1 flex-col px-6 pt-4 pb-6 md:px-7 md:pb-7">
        <p className="text-small text-night-muted">{kind}</p>
        <h3 className="mt-1 text-h3 text-night-text">
          <Link
            href={href}
            className="rounded-[4px] after:absolute after:inset-0 after:rounded-[inherit]"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-3 max-w-[48ch] text-night-muted">{oneLine}</p>
        {keyResult && (
          <p className="mt-5 flex items-baseline gap-3">
            <span className="text-h3 text-gilt">{keyResult.figure}</span>
            <span className="text-small text-night-muted">{keyResult.label}</span>
          </p>
        )}
        {todo && (
          <p className="mt-4 rounded-inline bg-gilt/15 px-3 py-2 text-small text-night-text">
            {todo}
          </p>
        )}
        <p className="mt-auto pt-6 text-small text-night-muted">
          <span className="font-semibold text-night-text">{status}.</span> Built with{" "}
          {list.format(stack)}.
        </p>
      </div>
    </article>
  );
}
