"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";

// Loads Motion's features once for the whole site and follows the visitor's reduced-motion setting.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
