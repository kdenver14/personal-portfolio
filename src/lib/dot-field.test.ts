import { describe, expect, it } from "vitest";
import { COLUMN_GAP, HOME, type Particle, floatOffset, poissonDisc, scatterDots, seededRandom, shadowAlpha, step } from "./dot-field";

const FIELD = { width: 1440, height: 900, column: 640 };
const atHome = (): Particle[] => scatterDots(FIELD, 7).map((dot) => ({ dot, offset: HOME }));

describe("seededRandom", () => {
  it("repeats the same sequence for the same seed", () => {
    const a = seededRandom(3);
    const b = seededRandom(3);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays within [0, 1)", () => {
    const random = seededRandom(11);
    const values = Array.from({ length: 1000 }, random);
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
  });
});

describe("poissonDisc", () => {
  const points = poissonDisc(200, 120, 20, seededRandom(1));

  it("keeps every pair of points at least the spacing apart", () => {
    const tooClose = points.some(([x, y], i) => points.slice(i + 1).some(([u, v]) => Math.hypot(x - u, y - v) < 20));
    expect(tooClose).toBe(false);
  });

  it("keeps every point inside the area and fills it", () => {
    expect(points.every(([x, y]) => x >= 0 && x < 200 && y >= 0 && y < 120)).toBe(true);
    expect(points.length).toBeGreaterThan(20);
  });
});

describe("scatterDots", () => {
  it("never places a dot within the gap around the text column", () => {
    const dots = scatterDots(FIELD, 7);
    expect(dots.length).toBeGreaterThan(0);
    expect(dots.every((dot) => Math.abs(dot.x - FIELD.width / 2) > FIELD.column / 2 + COLUMN_GAP)).toBe(true);
  });

  it("places no dots when the column fills the screen", () => {
    expect(scatterDots({ width: 390, height: 800, column: 350 }, 7)).toEqual([]);
  });

  it("gives the same scatter for the same size and seed", () => {
    expect(scatterDots(FIELD, 7)).toEqual(scatterDots(FIELD, 7));
  });
});

describe("floatOffset", () => {
  const [dot] = scatterDots(FIELD, 7);
  if (!dot) {
    throw new Error("Expected at least one dot");
  }

  it("stays home with no pointer or a distant pointer", () => {
    expect(floatOffset(dot, null, 1)).toEqual(HOME);
    expect(floatOffset(dot, [dot.x + 500, dot.y], 1)).toEqual(HOME);
  });

  it("lifts a dot under the pointer upward", () => {
    expect(floatOffset(dot, [dot.x, dot.y], 1)[1]).toBeLessThan(0);
  });
});

describe("step", () => {
  it("keeps moving while the pointer is over the dots", () => {
    const [first] = scatterDots(FIELD, 7);
    const pointer = first ? ([first.x, first.y] as const) : null;
    expect(step(atHome(), pointer, 0, 1 / 60).moving).toBe(true);
  });

  it("settles every dot home once the pointer leaves", () => {
    const [first] = scatterDots(FIELD, 7);
    let state = step(atHome(), first ? [first.x, first.y] : null, 0, 0.5);
    for (let frame = 0; frame < 120 && state.moving; frame++) {
      state = step(state.particles, null, frame / 60, 1 / 60);
    }
    expect(state.moving).toBe(false);
  });
});

describe("shadowAlpha", () => {
  it("is zero for a dot at rest and capped for a high one", () => {
    expect(shadowAlpha(0)).toBe(0);
    expect(shadowAlpha(-1000)).toBeLessThanOrEqual(0.08);
    expect(shadowAlpha(-4)).toBeGreaterThan(0);
  });
});
