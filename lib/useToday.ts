"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * Today's date in the visitor's browser, or null while prerendering.
 * Pages are static, so anything that counts days must be worked out here, not at build time.
 */
export function useToday() {
  const iso = useSyncExternalStore(subscribe, todayIso, () => null);
  return iso ? new Date(iso) : null;
}
