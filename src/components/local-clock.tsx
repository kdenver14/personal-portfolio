"use client";

import { useSyncExternalStore } from "react";
import { TIME_ZONE } from "@/content/profile";

const TICK_MS = 15_000;
const PLACEHOLDER = "--:--";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

function subscribe(onChange: () => void): () => void {
  const id = window.setInterval(onChange, TICK_MS);
  return () => window.clearInterval(id);
}

const readTime = (): string => formatter.format(new Date());
const readServerTime = (): string => PLACEHOLDER;

/** Current time in Antipolo. Renders a placeholder on the server so hydration never mismatches. */
export function LocalClock({ suffix = "" }: { suffix?: string }) {
  const time = useSyncExternalStore(subscribe, readTime, readServerTime);
  return (
    <time className="tabular" suppressHydrationWarning>
      {time}
      {suffix}
    </time>
  );
}
