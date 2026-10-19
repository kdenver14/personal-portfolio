import { describe, expect, it } from "vitest";
import { waveLines, type WaveOptions } from "./waves";

const OPTIONS: WaveOptions = {
  size: 100,
  lines: 5,
  step: 10,
  wavelength: 40,
  minAmplitude: 2,
  maxAmplitude: 6,
  phaseStep: 0.2,
  maxStroke: 2,
  minStroke: 0.5,
  thickAt: 0,
  thinAt: 1,
};

describe("waveLines", () => {
  it("returns one path per line", () => {
    expect(waveLines(OPTIONS)).toHaveLength(5);
  });

  it("draws every line as a single moveto followed by linetos", () => {
    for (const line of waveLines(OPTIONS)) {
      expect(line.d).toMatch(/^M-?\d+ -?\d+(L-?\d+ -?\d+)+$/);
    }
  });

  it("thins the stroke from the first line to the last", () => {
    const widths = waveLines(OPTIONS).map((line) => line.strokeWidth);
    expect(widths[0]).toBe(2);
    expect(widths.at(-1)).toBe(0.5);
    expect([...widths].sort((a, b) => b - a)).toEqual(widths);
  });

  it("is deterministic", () => {
    expect(waveLines(OPTIONS)).toEqual(waveLines(OPTIONS));
  });

  it("holds the thickest stroke up to thickAt", () => {
    const widths = waveLines({ ...OPTIONS, thickAt: 0.5 }).map((line) => line.strokeWidth);
    expect(widths.slice(0, 3)).toEqual([2, 2, 2]);
    expect(widths.at(-1)).toBe(0.5);
  });

  it("throws when thinAt does not come after thickAt", () => {
    expect(() => waveLines({ ...OPTIONS, thickAt: 0.6, thinAt: 0.6 })).toThrow(RangeError);
  });

  it("throws when asked for no lines", () => {
    expect(() => waveLines({ ...OPTIONS, lines: 0 })).toThrow(RangeError);
  });
});
