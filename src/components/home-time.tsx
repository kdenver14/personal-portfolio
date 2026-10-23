"use client";

import { useSyncExternalStore } from "react";
import { TIME_ZONE } from "@/content/profile";

const CLOCK_REFRESH_MS = 30_000;
const formatTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE });

function subscribeClock(onChange: () => void): () => void {
  const timer = window.setInterval(onChange, CLOCK_REFRESH_MS);
  return () => window.clearInterval(timer);
}

/** Home's local time, then `suffix`; nothing on the server, so the static build never freezes a time into the page. */
export function HomeTime({ prefix = "", suffix = "" }: { prefix?: string; suffix?: string }) {
  const time = useSyncExternalStore(subscribeClock, () => formatTime.format(new Date()), () => null);
  return time ? <span className="tabular">{`${prefix}${time}${suffix}`}</span> : null;
}
