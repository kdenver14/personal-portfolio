import { describe, expect, it } from "vitest";
import { seededRandom } from "./dot-field";
import { createNoise3 } from "./noise";

describe("createNoise3", () => {
  const noise = createNoise3(seededRandom(42));

  it("gives the same field for the same seed", () => {
    const again = createNoise3(seededRandom(42));
    expect([noise(0.3, 1.7, 2.2), noise(5.5, -3.1, 0.9)]).toEqual([again(0.3, 1.7, 2.2), again(5.5, -3.1, 0.9)]);
  });

  it("is zero at lattice points", () => {
    expect(noise(3, 7, 11)).toBeCloseTo(0);
  });

  it("changes smoothly between nearby points", () => {
    expect(Math.abs(noise(1.25, 2.5, 0.75) - noise(1.2501, 2.5, 0.75))).toBeLessThan(0.01);
  });

  it("stays within about ±1.5 and varies", () => {
    const values = Array.from({ length: 2000 }, (_, i) => noise(i * 0.37, i * 0.11, i * 0.05));
    expect(values.every((v) => Math.abs(v) <= 1.5)).toBe(true);
    expect(Math.max(...values) - Math.min(...values)).toBeGreaterThan(1);
  });
});
