import { cx } from "@/lib/cx";

// A text link to another site. The ↗ marks it as external; internal links never get an arrow.
export function ExternalLink({
  href,
  children,
  tone = "light",
  className,
  force,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "night";
  className?: string;
  force?: string;
}) {
  return (
    <a
      href={href}
      data-force={force}
      className={cx(
        "rounded-[2px] underline decoration-1 underline-offset-[5px]",
        "transition-[text-decoration-color] duration-(--dur-hover) ease-out",
        tone === "light"
          ? "text-signal decoration-signal/35 is-hover:decoration-signal"
          : "text-signal-soft decoration-signal-soft/35 is-hover:decoration-signal-soft",
        className,
      )}
    >
      {children}
      <span aria-hidden className="ml-0.5 inline-block">
        ↗
      </span>
    </a>
  );
}
