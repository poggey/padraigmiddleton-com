"use client";

import { useEffect, useRef } from "react";

/**
 * A gold tick on the page's left axis that marks how far down the page you are, on every page
 * rather than only on essays. Wide screens only, where the axis is visible.
 */
export function ReadingTick() {
  const tick = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? Math.min(1, scrollY / max) : 0;
      tick.current?.style.setProperty("translate", `-50% ${progress * (innerHeight - 96)}px`);
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={tick}
      aria-hidden
      className="pointer-events-none fixed top-16 z-40 hidden h-0.5 w-4 bg-gilt md:block"
      style={{ left: "max(0px, calc((100% - var(--container) - 2 * var(--gutter)) / 2))" }}
    />
  );
}
