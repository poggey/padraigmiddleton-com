"use client";

import { useEffect, useRef, useState } from "react";

export type CrosshairStop = { x: number; y: number; label: string; value: string };

/**
 * The hero's crosshair. Follows the pointer across the hero, snaps to the nearest maturity, and draws
 * a vertical line to the axis, a gold dot on today's curve, a dashed level back to the yield axis
 * and the reading on both axes. Decorative: the figures are also in the hero's description.
 */
export function AxisCrosshair({ stops }: { stops: CrosshairStop[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<CrosshairStop | null>(null);

  useEffect(() => {
    const plot = ref.current?.parentElement;
    // Listen on the whole hero, so the headline and buttons don't block it.
    const area = plot?.closest("section");
    if (!plot || !area) return;
    function move(e: PointerEvent) {
      const box = plot!.getBoundingClientRect();
      const fx = (e.clientX - box.left) / box.width;
      const nearest = stops.reduce((a, b) => (Math.abs(b.x - fx) < Math.abs(a.x - fx) ? b : a));
      setActive(nearest);
    }
    const leave = () => setActive(null);
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);
    return () => {
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
    };
  }, [stops]);

  const pct = (v: number) => `${v * 100}%`;
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      {active && (
        <>
          <div
            className="absolute top-0 bottom-0 w-px bg-signal-soft/55 transition-[left] duration-150 ease-out"
            style={{ left: pct(active.x) }}
          />
          <div
            className="absolute left-0 h-px border-t border-dashed border-gilt/45 transition-[top,width] duration-150 ease-out"
            style={{ top: pct(active.y), width: pct(active.x) }}
          />
          <div
            className="absolute size-2.5 -translate-1/2 rounded-full bg-gilt shadow-[0_0_0_3px_var(--axis-night)] transition-[left,top] duration-150 ease-out"
            style={{ left: pct(active.x), top: pct(active.y) }}
          />
          <div
            className="absolute top-full mt-2 -translate-x-1/2 bg-(--axis-night) px-1.5 text-small font-semibold whitespace-nowrap text-(--axis-text) transition-[left] duration-150 ease-out"
            style={{ left: pct(active.x) }}
          >
            {active.label} <span className="text-gilt">{active.value}</span>
          </div>
        </>
      )}
    </div>
  );
}
