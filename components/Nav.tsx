import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { cx } from "@/lib/cx";

export const navLinks = [
  { href: "/writing", label: "Writing" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

/**
 * The navigation bar. Transparent at the top of the page, glass once scrolled. `tone` follows
 * what is underneath: "night" over the dark hero and projects band, "light" elsewhere.
 * `SiteNav` supplies the state.
 */
export function Nav({
  scrolled = false,
  current,
  tone = "light",
  menuOpen = false,
  onMenu,
  pinned = false,
  progress,
}: {
  scrolled?: boolean;
  current?: string;
  tone?: "light" | "night";
  menuOpen?: boolean;
  onMenu?: () => void;
  /**
   * Keeps the bar still during page transitions. The name sits on the header itself: on an
   * ancestor it would make that ancestor a backdrop root and the glass would stop blurring.
   */
  pinned?: boolean;
  /** Reading progress, drawn along the bar's bottom edge on essay pages. */
  progress?: React.ReactNode;
}) {
  const night = tone === "night";
  return (
    <header
      data-tone={night ? "night" : undefined}
      className={cx(
        "relative",
        pinned && "[view-transition-name:site-header]",
        "transition-[background-color,box-shadow,color] duration-(--dur-hover) ease-out",
        scrolled ? (night ? "glass-bar-night" : "glass-bar") : "bg-transparent",
        night ? "text-night-text" : "text-ink",
      )}
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
              {navLinks.map((link) => {
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
                          className={cx(
                            "absolute inset-x-3 bottom-2 h-0.5 rounded-pill",
                            night ? "bg-signal-soft" : "bg-signal",
                          )}
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
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={onMenu}
            className="inline-flex size-11 items-center justify-center rounded-pill md:hidden"
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
      {progress}
    </header>
  );
}
