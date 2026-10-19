import { describe, expect, it } from "vitest";
import { ringCount, ringRadius, rippleTurn, waveRings, type RingOptions } from "./waves";

const OPTIONS: RingOptions = {
  innerRadius: 10,
  outerRadius: 100,
  growth: 1.25,
  lobes: 24,
  amplitude: 0.04,
  phaseStep: 0.3,
  strokeRatio: 0.005,
  step: 8,
};

const DEG = Math.PI / 180;

describe("waveRings", () => {
  it("adds rings until they pass the outer radius", () => {
    expect(ringCount(OPTIONS)).toBe(12);
    expect(waveRings(OPTIONS)).toHaveLength(12);
  });

  it("draws every ring as one moveto followed by linetos", () => {
    for (const ring of waveRings(OPTIONS)) {
      expect(ring.d).toMatch(/^M-?[\d.]+ -?[\d.]+(L-?[\d.]+ -?[\d.]+)+$/);
    }
  });

  it("maps each ring onto the next when scaled by growth and turned by rippleTurn, so the ripple loops seamlessly", () => {
    const turn = rippleTurn(OPTIONS) * DEG;
    for (const theta of [0.1, 0.7, 1.3]) {
      const scaledAndTurned = OPTIONS.growth * ringRadius(4, theta - turn, OPTIONS);
      expect(scaledAndTurned).toBeCloseTo(ringRadius(5, theta, OPTIONS), 9);
    }
  });

  it("grows the stroke with the radius by the same ratio as the rings", () => {
    // A large ratio keeps rounding to three decimals out of the comparison.
    const [first, second] = waveRings({ ...OPTIONS, strokeRatio: 0.5 });
    expect((second?.strokeWidth ?? 0) / (first?.strokeWidth ?? 1)).toBeCloseTo(OPTIONS.growth, 3);
  });

  it("throws when growth does not enlarge the rings", () => {
    expect(() => waveRings({ ...OPTIONS, growth: 1 })).toThrow(RangeError);
  });
});
