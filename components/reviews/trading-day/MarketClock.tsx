"use client";

import { useEffect, useId, useState } from "react";
import { paintTradingDay } from "./palette";

const OPEN = 8;
const CLOSE = 16.5;
const PREVIEW = "trading-day:preview";

type Now = { hour: number; weekday: number };

// The time in London now: hour (fractional) and weekday (0 Sunday to 6 Saturday).
function londonNow(): Now {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { hour: Number(get("hour")) + Number(get("minute")) / 60, weekday };
}

const clock = (hour: number) =>
  `${String(Math.floor(hour) % 24).padStart(2, "0")}:${String(Math.round((hour % 1) * 60) % 60).padStart(2, "0")}`;

function duration(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return h ? `${h} h ${m} min` : `${m} min`;
}

/** "Markets open", with how long until the close, or how long until the next open. */
function status({ hour, weekday }: Now) {
  const weekdayOpen = weekday >= 1 && weekday <= 5;
  if (weekdayOpen && hour >= OPEN && hour < CLOSE) {
    return { open: true, line: `Markets open, closing in ${duration(CLOSE - hour)}` };
  }
  if (weekdayOpen && hour < OPEN)
    return { open: false, line: `Markets open in ${duration(OPEN - hour)}` };
  const nextIsMonday = weekday === 5 || weekday === 6 || weekday === 0;
  return {
    open: false,
    line: `Markets closed, open ${nextIsMonday ? "Monday" : "tomorrow"} at 08:00`,
  };
}

/**
 * The live clock. "nav" shows the London time and whether the market is open; "footer" says how
 * long until it opens or closes. Both repaint the page's palette every minute, and follow the
 * preview slider while it is in use.
 */
export function MarketClock({ variant }: { variant: "nav" | "footer" }) {
  const [now, setNow] = useState<Now | null>(null);
  const [preview, setPreview] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(londonNow());
    tick();
    const timer = setInterval(tick, 30_000);
    const onPreview = (e: Event) => setPreview((e as CustomEvent<number | null>).detail);
    addEventListener(PREVIEW, onPreview);
    return () => {
      clearInterval(timer);
      removeEventListener(PREVIEW, onPreview);
    };
  }, []);

  useEffect(() => {
    if (variant === "nav" && now) paintTradingDay(preview ?? undefined);
  }, [variant, now, preview]);

  if (!now) return <span className="invisible">London 00:00</span>;
  const shown =
    preview === null
      ? now
      : { hour: preview, weekday: now.weekday === 0 || now.weekday === 6 ? 3 : now.weekday };
  const { open, line } = status(shown);

  if (variant === "nav") {
    return (
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className={`size-1.5 rounded-full ${open ? "bg-[#2fa36b]" : "bg-muted"}`}
        />
        London {clock(shown.hour)}
        {preview !== null && <span className="text-muted">(preview)</span>}
      </span>
    );
  }
  return <span>{line}</span>;
}

/** For the prototype only: drag through the day to see each palette. */
export function TimeScrubber() {
  const id = useId();
  const [hour, setHour] = useState<number | null>(null);

  function send(next: number | null) {
    setHour(next);
    dispatchEvent(new CustomEvent(PREVIEW, { detail: next }));
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-muted">
      <label htmlFor={id}>Preview another time of day</label>
      <input
        id={id}
        type="range"
        min={0}
        max={23.75}
        step={0.25}
        value={hour ?? 12}
        onChange={(e) => send(Number(e.target.value))}
        className="range w-48"
        style={{ "--fill": `${((hour ?? 12) / 23.75) * 100}%` } as React.CSSProperties}
      />
      <output htmlFor={id} className="w-12">
        {hour === null ? "Now" : clock(hour)}
      </output>
      {hour !== null && (
        <button type="button" onClick={() => send(null)} className="font-semibold text-signal">
          Back to now
        </button>
      )}
    </div>
  );
}
