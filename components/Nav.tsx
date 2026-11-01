import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { cx } from "@/lib/cx";

const links = [
  { href: "/writing", label: "Writing" },
  { href: "/projects", label: "Projects" },
  { href: "/ledger", label: "Ledger" },
  { href: "/about", label: "About" },
];

/**
 * The navigation bar. Transparent at the top of the page, glass once scrolled.
 * Phase 4 adds the scroll listener and the mobile menu sheet.
 */
export function Nav({
  scrolled = false,
  current,
  tone = "light",
}: {
  scrolled?: boolean;
  current?: string;
  /** "night" for pages that open on a dark hero. */
  tone?: "light" | "night";
}) {
  const night = tone === "night";
  return (
    <header
      className={cx(
        "transition-[background-color,box-shadow] duration-(--dur-hover) ease-out",
        scrolled ? "glass-bar" : "bg-transparent",
      )}
      data-tone={night ? "night" : undefined}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-[4px] text-ui font-semibold tracking-[-0.01em] whitespace-nowrap"
        >
          Padraig Middleton
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center">
              {links.map((link) => {
                const active = link.href === current;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "relative inline-flex h-11 items-center rounded-pill px-3 text-small font-medium",
                        "transition-colors duration-(--dur-hover) ease-out",
                        night
                          ? active
                            ? "text-night-text"
                            : "text-night-muted is-hover:text-night-text"
                          : active
                            ? "text-ink"
                            : "text-slate is-hover:text-ink",
                      )}
                    >
                      {link.label}
                      {active && (
                        <span
                          aria-hidden
                          className="absolute inset-x-3 bottom-2 h-0.5 rounded-pill bg-signal"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Button href="/cv.pdf" size="sm" tone={tone} className="md:ml-2">
            Download CV
          </Button>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={false}
            className={cx(
              "inline-flex size-11 items-center justify-center rounded-pill md:hidden",
              night ? "text-night-text" : "text-ink",
            )}
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 7h14M3 13h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </Container>
    </header>
  );
}
