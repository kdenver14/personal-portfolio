"use client";

import { useEffect, useRef } from "react";

/** Only a real mouse lights the dots; touch and pen moves usually mean scrolling or tapping. */
const HOVER_POINTER = "mouse";

/**
 * A band of grey dots around the screen edges. Dots near the mouse darken and grow: the frame tracks the
 * cursor in CSS variables, written at most once a frame. Decorative only.
 */
export function DotFrame() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) {
      return;
    }
    let pending = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      pending = 0;
      frame.style.setProperty("--hot-x", `${x}px`);
      frame.style.setProperty("--hot-y", `${y}px`);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== HOVER_POINTER) {
        return;
      }
      x = event.clientX;
      y = event.clientY;
      frame.dataset.hot = "";
      pending ||= requestAnimationFrame(paint);
    };
    const onLeave = () => {
      delete frame.dataset.hot;
    };
    const root = document.documentElement;
    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(pending);
    };
  }, []);

  return (
    <div ref={ref} className="frame" aria-hidden="true">
      <div className="frame-dots" />
      <div className="frame-hot" />
    </div>
  );
}
