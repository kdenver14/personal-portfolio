"use client";

import { setParticlesEnabled, useParticlesEnabled } from "./particles-setting";

/** A small switch pinned to the bottom-right corner that turns the background particles on and off. */
export function ParticlesToggle() {
  const enabled = useParticlesEnabled();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      className="particles-toggle"
      onClick={() => setParticlesEnabled(!enabled)}
    >
      Particles
      <span className="particles-switch" aria-hidden="true" />
    </button>
  );
}
