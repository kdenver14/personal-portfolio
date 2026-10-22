/**
 * The intro badge on its strap: a damped pendulum for the swing and a damped spring for the strap's stretch.
 * Angles are radians from straight down, positive toward the right. Times are ms and lengths are CSS px.
 */
export interface Lanyard {
  angle: number;
  /** Radians per ms. */
  spin: number;
  /** From the anchor to the card's top edge. */
  length: number;
  /** Px per ms the length is changing. */
  stretch: number;
}

/** Where the drag currently holds the card: the pointer's angle less `offset`, sampled at `at`. */
export interface Grip {
  offset: number;
  angle: number;
  at: number;
}

export const STRAP_LENGTH = 56;
const SWING = { stiffness: 0.000035, damping: 0.0011 };
const SPRING = { stiffness: 0.00022, damping: 0.016 };
const SUBSTEPS = 4;
const MAX_STEP_MS = 32;
const MAX_DRAG_ANGLE = 1.1;
const MAX_FLING = 0.012;
/** Letting go this long after the last move means the hand had stopped, so nothing is flung. */
const FLING_WINDOW_MS = 80;
const REST = { angle: 0.0008, spin: 0.00002, length: 0.2, stretch: 0.002 };
const SCROLL = { bob: 0.004, maxBob: 0.5, spin: 0.000012, maxSpin: 0.002 };
const DROP = { speed: 0.9, tilt: 0.1, clearance: 24 };

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export const hanging = (): Lanyard => ({ angle: 0, spin: 0, length: STRAP_LENGTH, stretch: 0 });

/** Out of sight above the anchor and already falling: how the badge waits until the reader reaches it. */
export const raised = (cardHeight: number): Lanyard => ({
  angle: DROP.tilt,
  spin: 0,
  length: -cardHeight - DROP.clearance,
  stretch: DROP.speed,
});

export function stepLanyard(lanyard: Lanyard, elapsedMs: number): Lanyard {
  const dt = Math.min(MAX_STEP_MS, Math.max(0, elapsedMs)) / SUBSTEPS;
  let { angle, spin, length, stretch } = lanyard;
  for (let step = 0; step < SUBSTEPS; step += 1) {
    spin += (-SWING.stiffness * Math.sin(angle) - SWING.damping * spin) * dt;
    angle += spin * dt;
    stretch += (-SPRING.stiffness * (length - STRAP_LENGTH) - SPRING.damping * stretch) * dt;
    length += stretch * dt;
  }
  return { angle, spin, length, stretch };
}

export function isResting({ angle, spin, length, stretch }: Lanyard): boolean {
  return (
    Math.abs(angle) < REST.angle &&
    Math.abs(spin) < REST.spin &&
    Math.abs(length - STRAP_LENGTH) < REST.length &&
    Math.abs(stretch) < REST.stretch
  );
}

export const grab = (lanyard: Lanyard, pointer: number, at: number): Grip => ({ offset: pointer - lanyard.angle, angle: lanyard.angle, at });

/** Turns the badge with the pointer, keeping the spot that was grabbed under it, and measures the spin for a fling. */
export function follow(lanyard: Lanyard, grip: Grip, pointer: number, at: number): { lanyard: Lanyard; grip: Grip } {
  const angle = clamp(pointer - grip.offset, MAX_DRAG_ANGLE);
  const spin = (angle - grip.angle) / Math.max(1, at - grip.at);
  return { lanyard: { ...lanyard, angle, spin }, grip: { ...grip, angle, at } };
}

export function letGo(lanyard: Lanyard, grip: Grip, at: number): Lanyard {
  return { ...lanyard, spin: at - grip.at > FLING_WINDOW_MS ? 0 : clamp(lanyard.spin, MAX_FLING) };
}

/** Scrolling jolts the anchor: the strap bobs against the scroll and the badge tips a little. */
export function jolt(lanyard: Lanyard, scrolledPx: number): Lanyard {
  return {
    ...lanyard,
    stretch: lanyard.stretch + clamp(-scrolledPx * SCROLL.bob, SCROLL.maxBob),
    spin: lanyard.spin + clamp(scrolledPx * SCROLL.spin, SCROLL.maxSpin),
  };
}

/** How far the card's top centre sits from where it hangs at rest. */
export function offsetFromRest({ angle, length }: Lanyard): { x: number; y: number } {
  return { x: length * Math.sin(angle), y: length * Math.cos(angle) - STRAP_LENGTH };
}
