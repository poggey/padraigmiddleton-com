"use client";

import { useEffect, useState, type RefObject } from "react";

/** Becomes true once `amount` of the element has been on screen, and stays true. */
export function useInView(ref: RefObject<Element | null>, amount = 0.4) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, amount]);
  return inView;
}
