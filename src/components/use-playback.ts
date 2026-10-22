"use client";

import { useEffect, useRef, useState } from "react";

export type PlaybackStatus = "playing" | "paused" | "done";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const CONTROL_LABEL = { playing: "Pause", paused: "Play", done: "Replay" } as const satisfies Record<PlaybackStatus, string>;

export interface Playback {
  readonly ms: number;
  readonly status: PlaybackStatus;
  /** Pause, resume, or start again from the top once done. */
  readonly toggle: () => void;
}

/**
 * A clock that runs from 0 to `duration` on requestAnimationFrame, only while playing. Under reduced motion,
 * or without autoplay, it starts on the last frame.
 */
export function usePlayback(duration: number, autoplay: boolean): Playback {
  const [status, setStatus] = useState<PlaybackStatus>(() =>
    autoplay && !window.matchMedia(REDUCED_MOTION).matches ? "playing" : "done",
  );
  const [ms, setMs] = useState(status === "playing" ? 0 : duration);
  const position = useRef(ms);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }
    const start = performance.now() - position.current;
    let frame = requestAnimationFrame(function tick(now) {
      position.current = Math.min(duration, now - start);
      setMs(position.current);
      if (position.current >= duration) {
        setStatus("done");
        return;
      }
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [status, duration]);

  const toggle = () => {
    if (status === "done") {
      position.current = 0;
      setMs(0);
    }
    setStatus(status === "playing" ? "paused" : "playing");
  };

  return { ms, status, toggle };
}
