"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/Button";
import { ExternalLink } from "@/components/ExternalLink";
import { navLinks } from "@/components/Nav";
import { cx } from "@/lib/cx";

/**
 * The phone menu: a glass sheet from the top. It is a native modal <dialog>, so the browser
 * traps focus inside it, closes it on Esc and returns focus to the menu button afterwards.
 * Tapping outside the sheet or following a link also closes it.
 */
export function MobileMenu({
  open,
  onClose,
  current,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  current?: string;
  contact: { linkedin: string; github: string };
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      id="mobile-menu"
      aria-label="Menu"
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      className={cx(
        "m-0 mb-auto w-full max-w-none bg-transparent p-3 text-ink md:hidden",
        "backdrop:bg-night/45",
        "transition-[opacity,translate,display,overlay] duration-(--dur-ui) ease-out transition-discrete",
        "starting:-translate-y-3 starting:opacity-0",
      )}
    >
      <div className="glass rounded-panel p-3">
        <div className="flex items-center justify-between pl-3">
          <p className="text-ui font-semibold">Padraig Middleton</p>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-control"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <nav aria-label="Main" className="mt-2">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={link.href === current ? "page" : undefined}
                  className={cx(
                    "flex min-h-14 items-center rounded-card px-3 text-h3",
                    link.href === current ? "text-signal" : "text-ink",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line px-3 pt-5 pb-2">
          <Button href="/cv.pdf">Download CV</Button>
          <ExternalLink href={contact.linkedin}>LinkedIn</ExternalLink>
          <ExternalLink href={contact.github}>GitHub</ExternalLink>
        </div>
      </div>
    </dialog>
  );
}
