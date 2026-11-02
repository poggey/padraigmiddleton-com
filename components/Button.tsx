import Link from "next/link";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "ghost";
type Tone = "light" | "night";

type Common = {
  variant?: Variant;
  tone?: Tone;
  size?: "md" | "sm";
  className?: string;
  children: React.ReactNode;
};

type AsLink = Common & { href: string; download?: boolean; external?: boolean };
type AsButton = Common & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-control font-medium whitespace-nowrap select-none " +
  "transition-[scale,box-shadow,background-color,color] duration-(--dur-hover) ease-out " +
  "is-active:scale-[0.98] is-active:duration-(--dur-press) disabled:pointer-events-none";

const sizes = { md: "h-11 px-5 text-ui", sm: "h-10 px-4 text-small font-semibold" };

// Solid blue for the main action, a quiet outline for the rest. No pills, no lift.
const variants: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: "bg-signal text-paper is-hover:bg-signal-deep disabled:bg-line disabled:text-muted",
    secondary:
      "bg-paper text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] is-hover:shadow-[inset_0_0_0_1px_var(--signal)] is-hover:text-signal disabled:text-muted",
    ghost: "text-ink is-hover:text-signal disabled:text-muted",
  },
  night: {
    primary:
      "bg-signal text-paper is-hover:bg-signal-deep disabled:bg-night-line disabled:text-night-muted",
    secondary:
      "text-night-text shadow-[inset_0_0_0_1px_var(--night-line-strong)] is-hover:shadow-[inset_0_0_0_1px_var(--signal-soft)] disabled:text-night-muted",
    ghost: "text-night-text is-hover:text-signal-soft disabled:text-night-muted",
  },
};

// A small chevron after the label of a primary link; it nudges right on hover.
function Chevron() {
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className="-mr-0.5 transition-transform duration-(--dur-hover) ease-out group-is-hover/button:translate-x-0.5"
    >
      <path
        d="M4.5 2.5L8 6l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The button look on its own, for a whole card that is one link but shows a button. */
export function buttonClasses({
  variant = "primary",
  tone = "light",
  size = "md",
}: { variant?: Variant; tone?: Tone; size?: "md" | "sm" } = {}) {
  return cx(base, sizes[size], variants[tone][variant]);
}

export { Chevron };

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", tone = "light", size = "md", className, children } = props;
  const classes = cx(base, sizes[size], variants[tone][variant], className);

  if (props.href !== undefined) {
    const { href, download, external } = props;
    // Files and other sites are plain links; internal pages use next/link for prefetching.
    if (download || external || href.endsWith(".pdf")) {
      return (
        <a href={href} download={download} className={classes}>
          {children}
          {external && <span aria-hidden>↗</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
        {variant === "primary" && <Chevron />}
      </Link>
    );
  }

  const { variant: _v, tone: _t, size: _s, className: _c, ...buttonProps } = props;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
