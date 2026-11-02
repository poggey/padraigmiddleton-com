"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reading progress for an essay, drawn inside the nav: a thin blue line along its bottom edge,
 * and "x min left" in the middle on wide screens. Measured against the essay body
 * ([data-essay-body]) and its reading time ([data-minutes] on the article). Decorative, so hidden
 * from screen readers.
 */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

  useEffect(() => {
    const body = document.querySelector<HTMLElement>("[data-essay-body]");
    const minutes = Number(body?.closest<HTMLElement>("[data-minutes]")?.dataset.minutes);
    if (!body || !minutes) return;

    let frame = 0;
    function update() {
      frame = 0;
      const box = body!.getBoundingClientRect();
      const navHeight = 64;
      const total = box.height - window.innerHeight + navHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, (navHeight - box.top) / total)) : 1;
      bar.current?.style.setProperty("scale", `${progress} 1`);
      setMinutesLeft(progress > 0 && progress < 1 ? Math.ceil(minutes * (1 - progress)) : null);
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
    <div aria-hidden>
      <div
        ref={bar}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-signal"
        style={{ scale: "0 1" }}
      />
      <p
        className={
          "pointer-events-none absolute top-0 left-1/2 hidden h-16 -translate-x-1/2 items-center text-small text-muted " +
          "transition-opacity duration-(--dur-hover) lg:flex " +
          (minutesLeft === null ? "opacity-0" : "opacity-100")
        }
      >
        {minutesLeft ?? 1} min left
      </p>
    </div>
  );
}
