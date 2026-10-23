import { describe, expect, it } from "vitest";
import { stopCenter, stopDiameter } from "./transit";

describe("stopDiameter", () => {
  it("draws a larger share as a larger stop", () => {
    expect(stopDiameter(35)).toBe(26);
    expect(stopDiameter(8)).toBe(17);
    expect(stopDiameter(35)).toBeGreaterThan(stopDiameter(21));
  });
});

describe("stopCenter", () => {
  it("puts the first and last of five stops a tenth in from each end", () => {
    expect(stopCenter(0, 5)).toBe(10);
    expect(stopCenter(4, 5)).toBe(90);
  });

  it("throws for a stop that is not on the line", () => {
    expect(() => stopCenter(5, 5)).toThrow(RangeError);
    expect(() => stopCenter(-1, 5)).toThrow(RangeError);
  });
});
