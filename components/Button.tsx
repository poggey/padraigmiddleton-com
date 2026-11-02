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
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap select-none " +
  "transition-[translate,scale,box-shadow,background-color,color] duration-(--dur-hover) ease-out " +
  "is-hover:-translate-y-px is-active:scale-[0.98] is-active:duration-(--dur-press) " +
  "disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none";

const sizes = { md: "px-5 text-ui", sm: "px-4 text-small font-semibold" };

const variants: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: "bg-ink text-paper shadow-e1 is-hover:shadow-e2 disabled:bg-line disabled:text-muted",
    secondary:
      "bg-paper text-ink shadow-e1 is-hover:shadow-e2 disabled:bg-porcelain disabled:text-muted",
    ghost: "text-ink is-hover:bg-paper is-hover:shadow-e1 disabled:text-muted",
  },
  night: {
    primary:
      "bg-paper text-ink is-hover:shadow-e2 disabled:bg-night-line disabled:text-night-muted",
    secondary:
      "bg-night-raised text-night-text shadow-[inset_0_0_0_1px_var(--night-line-strong)] disabled:text-night-muted",
    ghost: "text-night-text is-hover:bg-night-raised disabled:text-night-muted",
  },
};

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
