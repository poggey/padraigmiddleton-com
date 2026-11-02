"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cx } from "@/lib/cx";

/**
 * A large headline with a glass lens over it. The lens follows the cursor and magnifies the
 * words beneath, with a faint colour fringe at the rim like real glass. Inside the lens is an
 * enlarged copy of the same text, positioned so the point under the centre lines up exactly.
 * With no cursor it drifts slowly across the words.
 */
const SCALE = 1.6;

export function Lens({ text, className }: { text: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = box.current;
    const glass = lens.current;
    const inner = copy.current;
    if (!el || !glass || !inner) return;

    let width = 0;
    let height = 0;
    let radius = 110;
    const at = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let lastMove = -Infinity;
    let frame = 0;
    let visible = true;

    function measure() {
      width = el!.clientWidth;
      height = el!.clientHeight;
      radius = width < 600 ? 72 : 112;
      inner!.style.width = `${width}px`;
      glass!.style.width = glass!.style.height = `${radius * 2}px`;
      if (!at.x) {
        at.x = target.x = width * 0.55;
        at.y = target.y = height * 0.78;
      }
    }

    function paint() {
      glass!.style.translate = `${at.x - radius}px ${at.y - radius}px`;
      inner!.style.translate = `${radius - at.x * SCALE}px ${radius - at.y * SCALE}px`;
    }

    function tick(now: number) {
      if (now - lastMove > 2500) {
        target.x = width * (0.45 + 0.35 * Math.sin(now / 5600));
        target.y = height * (0.5 + 0.34 * Math.sin(now / 3900));
      }
      at.x += (target.x - at.x) * 0.09;
      at.y += (target.y - at.y) * 0.09;
      paint();
      if (visible && !document.hidden && !reduced) frame = requestAnimationFrame(tick);
    }
    const restart = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    function onPointerMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      // Keep the lens over the words: clamp it inside the headline's box.
      target.x = Math.max(radius * 0.4, Math.min(width - radius * 0.4, event.clientX - rect.left));
      target.y = Math.max(radius * 0.4, Math.min(height - radius * 0.4, event.clientY - rect.top));
      lastMove = performance.now();
      if (reduced) {
        at.x = target.x;
        at.y = target.y;
        paint();
      }
    }

    const resizer = new ResizeObserver(() => {
      measure();
      paint();
      restart();
    });
    resizer.observe(el);
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) restart();
    });
    watcher.observe(el);
    const onVisibility = () => !document.hidden && restart();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduced]);

  const type = "text-display text-night-text";

  return (
    <div ref={box} className={cx("relative", className)}>
      <h1 className={type}>{text}</h1>
      <div
        ref={lens}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 overflow-hidden rounded-full bg-night shadow-[0_24px_60px_-12px_var(--glass-shadow)]"
      >
        <div
          ref={copy}
          className={cx(
            type,
            "absolute top-0 left-0 origin-top-left scale-[1.6]",
            "[text-shadow:-1.5px_0_var(--fringe-warm),1.5px_0_var(--fringe-cool)]",
          )}
        >
          {text}
        </div>
        {/* The glass: a bright rim, a soft highlight top left, a darker edge bottom right. */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_var(--glass-rim),inset_10px_14px_30px_-12px_var(--glass-shine),inset_-12px_-16px_30px_-14px_var(--glass-shadow)]" />
        <div className="absolute top-[9%] left-[16%] h-[22%] w-[38%] rotate-[-28deg] rounded-[50%] bg-[radial-gradient(closest-side,var(--glass-shine),transparent)]" />
      </div>
    </div>
  );
}
