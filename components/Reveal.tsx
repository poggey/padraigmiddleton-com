"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Draws a data graphic in once, when 40% of it is visible. Server-rendered content stays visible
 * without JavaScript; with it, the graphic is set to "pending" before first paint and to "done"
 * on view. The animation itself is CSS (see the data-reveal rules in globals.css).
 */
export function Reveal({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.reveal = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Next frame, so the pending state has painted and the transition runs.
        requestAnimationFrame(() => (el.dataset.reveal = "done"));
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="done" className={className}>
      {children}
    </div>
  );
}
