import { describe, expect, it } from "vitest";
import { arcSpan, lobeCount, squiggleArc, squiggleRadius, type SquiggleOptions } from "./waves";

const OPTIONS: SquiggleOptions = { radius: 100, wavelength: 60, amplitude: 5 };
const LOBES = lobeCount(OPTIONS.radius, OPTIONS.wavelength);
const WAVE = (2 * Math.PI) / LOBES;

function startPoint(d: string): [number, number] {
  const match = /^M(-?[\d.]+) (-?[\d.]+)/.exec(d);
  return [Number(match?.[1]), Number(match?.[2])];
}

describe("squiggleArc", () => {
  it("rounds the wavelength so a full turn holds a whole number of waves", () => {
    expect(LOBES).toBe(10);
    expect(squiggleArc(OPTIONS).lobes).toBe(LOBES);
  });

  it("lands on itself when turned by one wave, so the drift loops seamlessly", () => {
    for (const theta of [0, 0.4, 1.1, 1.5]) {
      expect(squiggleRadius(theta + WAVE, OPTIONS, LOBES)).toBeCloseTo(squiggleRadius(theta, OPTIONS, LOBES), 9);
    }
  });

  it("runs more than one wave past both edges of the quarter turn, so turning by a wave never shows an end", () => {
    const { start, end } = arcSpan(LOBES);
    expect(start).toBeLessThan(-WAVE);
    expect(end).toBeGreaterThan(Math.PI / 2 + WAVE);
  });

  it("draws one moveto followed by cubic curves, starting on the squiggle", () => {
    const { d } = squiggleArc(OPTIONS);
    expect(d).toMatch(/^M-?[\d.]+ -?[\d.]+(C-?[\d.]+ -?[\d.]+ -?[\d.]+ -?[\d.]+ -?[\d.]+ -?[\d.]+)+$/);
    const [x, y] = startPoint(d);
    expect(Math.hypot(x, y)).toBeCloseTo(squiggleRadius(arcSpan(LOBES).start, OPTIONS, LOBES), 0);
  });

  it("throws when the wave is as tall as the radius", () => {
    expect(() => squiggleArc({ ...OPTIONS, amplitude: OPTIONS.radius })).toThrow(RangeError);
  });
});
