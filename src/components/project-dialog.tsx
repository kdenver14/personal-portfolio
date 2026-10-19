"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

/*
 * The open project lives in the URL hash (#hand-gesture-control), so a project can be linked
 * directly and the browser's back button closes it. One shared store serves every dialog.
 */
const listeners = new Set<() => void>();
let navigatedInPage = false;

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function onHashChange(): void {
  navigatedInPage = true;
  emit();
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    window.addEventListener("hashchange", onHashChange);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("hashchange", onHashChange);
    }
  };
}

const readHash = (): string => window.location.hash;
const readServerHash = (): string => "";

/** Clears the project hash: back through history when a card click pushed it, in place for a direct link. */
function leaveProject(): void {
  if (navigatedInPage) {
    window.history.back();
    return;
  }
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  emit();
}

export function ProjectDialog({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  const isOpen = useSyncExternalStore(subscribe, readHash, readServerHash) === `#${id}`;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) {
      return;
    }
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={`${id}-title`}
      onClose={() => {
        if (window.location.hash === `#${id}`) {
          leaveProject();
        }
      }}
      onPointerDown={(event) => {
        pressedBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        // Only a press that starts and ends on the backdrop closes; a text selection dragged out does not.
        if (pressedBackdrop.current && event.target === event.currentTarget) {
          close();
        }
      }}
    >
      <div className="dialog-bar">
        <button type="button" className="dialog-close" onClick={close}>
          Close
        </button>
      </div>
      <div className="dialog-body">{children}</div>
    </dialog>
  );
}
