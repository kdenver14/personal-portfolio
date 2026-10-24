import { useSyncExternalStore } from "react";

const STORAGE_KEY = "particles";
const OFF = "off";

const listeners = new Set<() => void>();
let enabled: boolean | undefined;

/** The visitor's saved choice, or on. Storage can be blocked (private windows, strict settings); particles then start on. */
function readSaved(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== OFF;
  } catch {
    return true;
  }
}

/** Whether the background particles are on for this visitor. */
export function particlesEnabled(): boolean {
  enabled ??= readSaved();
  return enabled;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Turns the background particles on or off, remembered on this device when storage allows. */
export function setParticlesEnabled(next: boolean): void {
  enabled = next;
  try {
    if (next) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, OFF);
    }
  } catch {
    // Storage is blocked, so the choice holds only until the page reloads; the toggle still works meanwhile.
  }
  for (const listener of listeners) {
    listener();
  }
}

/** On during the server render, then the visitor's choice; re-renders whenever it changes. */
export function useParticlesEnabled(): boolean {
  return useSyncExternalStore(subscribe, particlesEnabled, () => true);
}
