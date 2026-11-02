"use client";

import { useEffect, useRef } from "react";

/**
 * Reading progress for an essay: a thin blue line along the nav's bottom edge, measured against
 * the essay body ([data-essay-body]). Decorative, so hidden from screen readers.
 */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = document.querySelector<HTMLElement>("[data-essay-body]");
    if (!body) return;

    let frame = 0;
    function update() {
      frame = 0;
      const box = body!.getBoundingClientRect();
      const navHeight = 64;
      const total = box.height - window.innerHeight + navHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, (navHeight - box.top) / total)) : 1;
      bar.current?.style.setProperty("scale", `${progress} 1`);
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
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-signal"
      style={{ scale: "0 1" }}
    />
  );
}
