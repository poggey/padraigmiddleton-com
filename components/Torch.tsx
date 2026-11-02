"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A dark surface with writing hidden beneath it. A soft circle of light follows the cursor and
 * reveals the text, as if reading by torchlight. With no cursor (phones, or when the visitor
 * stops moving) the light drifts slowly on its own. Under reduced motion it stays still.
 */
export function Torch({
  paragraphs,
  quiet = false,
  className,
  children,
}: {
  paragraphs: string[];
  /** Fainter writing and a smaller light, for places where the torch is a background detail. */
  quiet?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const light = { x: 0.7, y: 0.42 };
    const target = { ...light };
    let lastMove = -Infinity;
    let frame = 0;
    let visible = true;

    const paint = () => {
      el.style.setProperty("--x", `${light.x * 100}%`);
      el.style.setProperty("--y", `${light.y * 100}%`);
    };
    paint();
    if (reduced) return;

    function tick(now: number) {
      // After a pause, the light wanders slowly across the page.
      if (now - lastMove > 2500) {
        target.x = 0.62 + 0.28 * Math.sin(now / 6100);
        target.y = 0.48 + 0.3 * Math.sin(now / 4300);
      }
      light.x += (target.x - light.x) * 0.07;
      light.y += (target.y - light.y) * 0.07;
      paint();
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    const restart = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    function onPointerMove(event: PointerEvent) {
      const box = el!.getBoundingClientRect();
      target.x = (event.clientX - box.left) / box.width;
      target.y = (event.clientY - box.top) / box.height;
      lastMove = performance.now();
    }

    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) restart();
    });
    watcher.observe(el);
    const onVisibility = () => !document.hidden && restart();
    document.addEventListener("visibilitychange", onVisibility);
    el.addEventListener("pointermove", onPointerMove);
    return () => {
      cancelAnimationFrame(frame);
      watcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      el.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduced]);

  const text = (
    <div className="columns-1 gap-14 px-(--gutter) pt-24 font-serif text-essay-body md:columns-2 xl:columns-3">
      {[...paragraphs, ...paragraphs].map((p, i) => (
        <p key={i} className="mb-6 break-inside-avoid-column">
          {p}
        </p>
      ))}
    </div>
  );
  const mask = `radial-gradient(circle ${quiet ? 240 : 300}px at var(--x) var(--y), #000 0%, rgb(0 0 0 / 0.5) 45%, transparent 78%)`;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <div aria-hidden className="absolute inset-0 text-night-muted opacity-[0.05] select-none">
        {text}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 text-night-muted select-none"
        style={{ maskImage: mask, WebkitMaskImage: mask, opacity: quiet ? 0.55 : 1 }}
      >
        {text}
      </div>
      {/* A soft shade keeps the headline column clean; the light mostly finds text to the right. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--night)_70%,transparent_100%)] lg:bg-[linear-gradient(to_right,var(--night)_32%,transparent_60%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
