"use client";

import { useEffect, type RefObject } from "react";
import { useReducedMotionConfig } from "motion/react";

export type Frame = {
  /** Seconds since the graphic started; a large constant under reduced motion. */
  time: number;
  /** Cursor relative to the canvas centre, -1 to 1 on each axis, eased. */
  pointer: { x: number; y: number };
  reduced: boolean;
};

/**
 * Runs a canvas graphic: calls `draw` every frame while it is on screen and the tab is visible,
 * eases the cursor position, and under reduced motion draws one still frame.
 * `setup` returns the draw function (or null if the browser cannot run it). `draw` returns true
 * while it still needs frames (for example during a load animation).
 */
export function useCanvasLoop(
  ref: RefObject<HTMLCanvasElement | null>,
  setup: (canvas: HTMLCanvasElement) => ((frame: Frame) => boolean) | null,
) {
  const reduced = useReducedMotionConfig() ?? false;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = setup(canvas);
    if (!draw) return;

    const start = performance.now();
    const target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;

    function tick(now: number) {
      pointer.x += (target.x - pointer.x) * 0.05;
      pointer.y += (target.y - pointer.y) * 0.05;
      const busy = draw!({ time: reduced ? 1000 : (now - start) / 1000, pointer, reduced });
      if (visible && !document.hidden && (!reduced || busy)) frame = requestAnimationFrame(tick);
    }
    const restart = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    function onPointerMove(event: PointerEvent) {
      const box = canvas!.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1));
    }

    const resizer = new ResizeObserver(restart);
    resizer.observe(canvas);
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) restart();
    });
    watcher.observe(canvas);
    const onVisibility = () => !document.hidden && restart();
    document.addEventListener("visibilitychange", onVisibility);
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine && !reduced) window.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
    };
    // setup is defined inline by each graphic and only depends on the reduced flag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
}
