"use client";

import type { FocusEvent, PointerEvent, ReactNode } from "react";

/**
 * Pointing at or tabbing into a language (its bar segment or its column) marks every element of that language with
 * `data-on` and the group with `data-focus`; the stylesheet dims the rest. Elements opt in with `data-lang`.
 */
function focusLanguage(group: HTMLElement, target: EventTarget | null) {
  const language = target instanceof Element ? target.closest<HTMLElement>("[data-lang]")?.dataset.lang : undefined;
  group.toggleAttribute("data-focus", language !== undefined);
  for (const element of group.querySelectorAll<HTMLElement>("[data-lang]")) {
    element.toggleAttribute("data-on", element.dataset.lang === language);
  }
}

export function GlanceFocus({ className, children }: { className: string; children: ReactNode }) {
  const onPoint = (event: PointerEvent<HTMLDivElement>) => focusLanguage(event.currentTarget, event.target);
  const onFocus = (event: FocusEvent<HTMLDivElement>) => focusLanguage(event.currentTarget, event.target);
  const onLeave = (event: PointerEvent<HTMLDivElement> | FocusEvent<HTMLDivElement>) => focusLanguage(event.currentTarget, null);
  return (
    <div className={className} onPointerOver={onPoint} onPointerLeave={onLeave} onFocus={onFocus} onBlur={onLeave}>
      {children}
    </div>
  );
}
