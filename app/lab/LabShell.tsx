"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import { Switch } from "@/components/Switch";

// Lab toolbar. The switch simulates prefers-reduced-motion for CSS (data-motion) and Motion.
export function LabShell({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (reduced) root.dataset.motion = "reduce";
    else delete root.dataset.motion;
    return () => {
      delete root.dataset.motion;
    };
  }, [reduced]);

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <div className="sticky top-0 z-50 glass-bar">
        <div className="mx-auto box-content flex h-14 max-w-page items-center justify-between gap-4 px-(--gutter)">
          <p className="text-ui font-semibold">Design lab</p>
          <Switch checked={reduced} onChange={setReduced} label="Simulate reduced motion" />
        </div>
      </div>
      {children}
    </MotionConfig>
  );
}
