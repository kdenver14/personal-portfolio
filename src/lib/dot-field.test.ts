import { describe, expect, it } from "vitest";
import {
  COLUMN_DIM,
  COLUMN_GAP,
  type Mark,
  advance,
  easeToward,
  poissonDisc,
  pointerCentre,
  ringAt,
  scatterParticles,
  seededRandom,
  sizeTarget,
  toStrokes,
} from "./dot-field";
import { createNoise3 } from "./noise";

const FIELD = { width: 1440, height: 900, column: 640 };
const still = () => 0;

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

describe("scatterParticles", () => {
  it("dims particles under the text column and keeps the margins at full strength", () => {
    const particles = scatterParticles(FIELD, 7);
    const under = particles.filter((p) => Math.abs(p.x - FIELD.width / 2) <= FIELD.column / 2 + COLUMN_GAP);
    expect(under.length).toBeGreaterThan(0);
    expect(under.every((p) => p.visibility === COLUMN_DIM)).toBe(true);
    expect(particles.some((p) => p.visibility === 1)).toBe(true);
  });

  it("still fills a phone screen, dimmed, when the column takes its whole width", () => {
    const particles = scatterParticles({ width: 390, height: 800, column: 390 }, 7);
    expect(particles.length).toBeGreaterThan(0);
    expect(particles.every((p) => p.visibility === COLUMN_DIM)).toBe(true);
  });

  it("gives the same scatter for the same size and seed", () => {
    expect(scatterParticles(FIELD, 7)).toEqual(scatterParticles(FIELD, 7));
  });
});

describe("easeToward", () => {
  it("covers the same ground in two half steps as in one full step", () => {
    const once = easeToward([0, 0], [100, 50], 0.2, 0.45);
    const twice = easeToward(easeToward([0, 0], [100, 50], 0.1, 0.45), [100, 50], 0.1, 0.45);
    expect(twice[0]).toBeCloseTo(once[0]);
    expect(twice[1]).toBeCloseTo(once[1]);
  });

  it("stays put with no time and arrives after a long time", () => {
    expect(easeToward([10, 10], [90, 90], 0, 0.45)).toEqual([10, 10]);
    expect(easeToward([10, 10], [90, 90], 60, 0.45)[0]).toBeCloseTo(90);
  });
});

describe("pointerCentre", () => {
  it("keeps the ring circling near a resting mouse", () => {
    const a = pointerCentre([500, 400], FIELD, 0);
    const b = pointerCentre([500, 400], FIELD, 2);
    expect(a).not.toEqual(b);
    expect(Math.hypot(a[0] - 500, a[1] - 400)).toBeLessThan(40);
  });
});

describe("sizeTarget", () => {
  const ring = ringAt([720, 450], FIELD, 0);

  it("is full on the ring, medium inside it and a speck far outside", () => {
    expect(sizeTarget(ring.radius, ring, 0)).toBeCloseTo(1);
    const inside = sizeTarget(ring.radius * 0.2, ring, 0);
    expect(inside).toBeGreaterThan(0.3);
    expect(inside).toBeLessThan(0.6);
    expect(sizeTarget(ring.radius * 3, ring, 0)).toBeLessThan(1 / 6);
  });
});

describe("advance", () => {
  const ring = ringAt([720, 450], FIELD, 0);
  const onRing = { x: 720 + ring.radius, y: 450, visibility: 1 };
  const farOut = { x: 720 + ring.radius * 3, y: 450, visibility: 1 };

  it("swells particles on the ring and leaves far ones as specks", () => {
    const { sizes } = advance([onRing, farOut], [], ring, 0, 0, still);
    expect(sizes[0]).toBeCloseTo(1);
    expect(sizes[1]).toBeLessThan(1 / 6);
  });

  it("eases a size toward its target instead of jumping", () => {
    const { sizes } = advance([onRing], [0], ring, 0, 1 / 60, still);
    expect(sizes[0]).toBeGreaterThan(0);
    expect(sizes[0]).toBeLessThan(0.2);
  });

  it("points each dash away from the ring centre", () => {
    const { marks } = advance([onRing], [], ring, 0, 0, still);
    expect(marks[0]?.angle).toBeCloseTo(0);
  });

  it("keeps particles drifting while the ring stays still", () => {
    const noise = createNoise3(seededRandom(42));
    const at = (seconds: number) => advance([farOut], [], ring, seconds, 0, noise).marks[0];
    expect(at(0)?.x).not.toBeCloseTo(at(2)?.x ?? 0);
  });
});

describe("toStrokes", () => {
  const mark = (size: number, visibility = 1): Mark => ({ x: 10, y: 10, angle: 0, size, visibility });

  it("draws marks of the same size and fade with one stroke", () => {
    const strokes = toStrokes([mark(0.9), mark(0.95), mark(0.05)]);
    expect(strokes).toHaveLength(2);
    expect(strokes.map((s) => s.segments.length).sort()).toEqual([4, 8]);
  });

  it("skips marks that are fully faded", () => {
    expect(toStrokes([mark(1, 0.1)])).toEqual([]);
  });

  it("makes bigger marks longer and bolder", () => {
    const [small, big] = [toStrokes([mark(0.2)])[0], toStrokes([mark(0.99)])[0]];
    const length = (s: typeof small) => (s ? (s.segments[2] ?? 0) - (s.segments[0] ?? 0) : 0);
    expect(length(big)).toBeGreaterThan(length(small));
    expect(big?.width).toBeGreaterThan(small?.width ?? Infinity);
  });
});
