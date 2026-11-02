"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/MobileMenu";
import { Nav, navLinks } from "@/components/Nav";

/**
 * The live navigation: fixed to the top, glass after 8px of scroll, and night-toned while it sits
 * over any section marked data-nav-tone="night" (the hero, the projects band, the footer).
 */
// Pages whose first section is dark (the homepage hero).
const darkTop = new Set(["/"]);

export function SiteNav({ contact }: { contact: { linkedin: string; github: string } }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Night-toned from the first paint on pages that open on a dark hero, before any script runs.
  const [tone, setTone] = useState<"light" | "night">(darkTop.has(pathname) ? "night" : "light");
  // The page the menu was opened on. Navigating anywhere else closes it automatically.
  const [menuPage, setMenuPage] = useState<string | null>(null);
  const menuOpen = menuPage === pathname;

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      setScrolled(window.scrollY > 8);
      // Which section is directly under the middle of the bar?
      const probe = 32;
      const night = Array.from(document.querySelectorAll("[data-nav-tone='night']")).some((el) => {
        const box = el.getBoundingClientRect();
        return box.top <= probe && box.bottom >= probe;
      });
      setTone(night ? "night" : "light");
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  const current = navLinks.find(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`),
  )?.href;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <Nav
        pinned
        scrolled={scrolled}
        tone={tone}
        current={current}
        menuOpen={menuOpen}
        onMenu={() => setMenuPage(pathname)}
      />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuPage(null)}
        current={current}
        contact={contact}
      />
    </div>
  );
}
