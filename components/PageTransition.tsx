"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

/**
 * Cross-fades between pages. Keyed by the path, so only navigation animates the whole page;
 * updates inside a page (tabs, filters) animate on their own.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="auto" exit="auto" default="none">
      {children}
    </ViewTransition>
  );
}
