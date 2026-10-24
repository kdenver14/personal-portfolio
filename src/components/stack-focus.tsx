"use client";

import type { FocusEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import { useState } from "react";

const IDLE_CAPTION = "Point at or tap a technology to see what I use it for.";

interface Picked {
  name: string;
  note: string;
}

/**
 * Marks the tile under `target` with `data-on` and returns its name and note, or clears every mark and returns null.
 * Tiles opt in with `data-name` and `data-note`.
 */
function markTile(group: HTMLElement, target: EventTarget | null): Picked | null {
  const tile = target instanceof Element ? target.closest<HTMLElement>("[data-note]") : null;
  for (const each of group.querySelectorAll("[data-note]")) {
    each.toggleAttribute("data-on", each === tile);
  }
  const { name, note } = tile?.dataset ?? {};
  return name && note ? { name, note } : null;
}

/** Wraps the Stack groups: pointing at, focusing or tapping a tile shows its note in the caption below them. */
export function StackFocus({ children }: { children: ReactNode }) {
  const [picked, setPicked] = useState<Picked | null>(null);
  const pick = (event: FocusEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) =>
    setPicked(markTile(event.currentTarget, event.target));
  const release = (event: FocusEvent<HTMLDivElement> | PointerEvent<HTMLDivElement>) =>
    setPicked(markTile(event.currentTarget, null));
  const ifMouse = (act: (event: PointerEvent<HTMLDivElement>) => void) => (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") act(event);
  };
  return (
    <div className="stack" onPointerOver={ifMouse(pick)} onPointerLeave={ifMouse(release)} onFocus={pick} onBlur={release} onClick={pick}>
      {children}
      {/* Mirrors the tile's own screen-reader text, so it stays hidden from assistive tech. */}
      <p className={`stack-caption${picked ? " is-active" : ""}`} aria-hidden="true">
        {picked ? (
          <>
            <b>{picked.name}.</b> {picked.note}
          </>
        ) : (
          IDLE_CAPTION
        )}
      </p>
    </div>
  );
}
