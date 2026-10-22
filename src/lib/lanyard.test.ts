import { describe, expect, it } from "vitest";
import {
  type Lanyard,
  STRAP_LENGTH,
  follow,
  grab,
  hanging,
  isResting,
  jolt,
  letGo,
  offsetFromRest,
  raised,
  stepLanyard,
} from "./lanyard";

const FRAME_MS = 16;
const TIPPED: Lanyard = { ...hanging(), angle: 0.12 };

function run(lanyard: Lanyard, ms: number): Lanyard {
  let state = lanyard;
  for (let elapsed = 0; elapsed < ms; elapsed += FRAME_MS) {
    state = stepLanyard(state, FRAME_MS);
  }
  return state;
}

describe("stepLanyard", () => {
  it("leaves a hanging badge where it is", () => {
    expect(stepLanyard(hanging(), FRAME_MS)).toEqual(hanging());
  });

  it("swings a tipped badge back through the middle, then settles it", () => {
    const passes = [0, 200, 400, 600, 800].map((ms) => run(TIPPED, ms).angle);
    expect(Math.min(...passes)).toBeLessThan(0);
    expect(isResting(run(TIPPED, 20_000))).toBe(true);
  });

  it("drops a raised badge onto the strap, overshooting once before it settles", () => {
    const lengths = Array.from({ length: 60 }, (_, frame) => run(raised(260), frame * FRAME_MS).length);
    expect(Math.max(...lengths)).toBeGreaterThan(STRAP_LENGTH);
    expect(run(raised(260), 20_000).length).toBeCloseTo(STRAP_LENGTH, 0);
  });

  it("caps a long gap between frames, so a backgrounded tab doesn't fling the badge", () => {
    expect(stepLanyard(TIPPED, 5_000)).toEqual(stepLanyard(TIPPED, 32));
  });
});

describe("isResting", () => {
  it("is false while the badge still moves", () => {
    expect(isResting(hanging())).toBe(true);
    expect(isResting(TIPPED)).toBe(false);
    expect(isResting({ ...hanging(), stretch: 0.1 })).toBe(false);
  });
});

describe("dragging", () => {
  it("keeps the grabbed spot under the pointer and measures the spin", () => {
    const grip = grab(hanging(), 0.3, 0);
    const moved = follow(hanging(), grip, 0.5, 100);
    expect(moved.lanyard.angle).toBeCloseTo(0.2);
    expect(moved.lanyard.spin).toBeCloseTo(0.002);
  });

  it("stops the badge from being dragged past its swing limit", () => {
    const moved = follow(hanging(), grab(hanging(), 0, 0), 3, 100);
    expect(moved.lanyard.angle).toBeCloseTo(1.1);
  });

  it("flings on a moving release, and drops dead after the hand has stopped", () => {
    const { lanyard, grip } = follow(hanging(), grab(hanging(), 0, 0), 0.8, 20);
    expect(letGo(lanyard, grip, 30).spin).toBeCloseTo(0.012);
    expect(letGo(lanyard, grip, 500).spin).toBe(0);
  });
});

describe("jolt", () => {
  it("bobs the strap against the scroll and tips the badge, both capped", () => {
    const down = jolt(hanging(), 50);
    expect(down.stretch).toBeLessThan(0);
    expect(down.spin).toBeGreaterThan(0);
    expect(jolt(hanging(), 10_000)).toMatchObject({ stretch: -0.5, spin: 0.002 });
  });
});

describe("offsetFromRest", () => {
  it("is zero at rest, and moves the card sideways and up as it swings", () => {
    expect(offsetFromRest(hanging())).toEqual({ x: 0, y: 0 });
    const tipped = offsetFromRest({ ...hanging(), angle: Math.PI / 6 });
    expect(tipped.x).toBeCloseTo(STRAP_LENGTH / 2);
    expect(tipped.y).toBeLessThan(0);
  });
});
