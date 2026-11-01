import { cx } from "@/lib/cx";

// A text link to another site. The ↗ marks it as external; internal links never get an arrow.
export function ExternalLink({
  href,
  children,
  className,
  force,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  force?: string;
}) {
  return (
    <a
      href={href}
      data-force={force}
      className={cx(
        "rounded-[2px] text-signal underline decoration-signal/35 decoration-1 underline-offset-[5px]",
        "transition-[text-decoration-color] duration-(--dur-hover) ease-out is-hover:decoration-signal",
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
