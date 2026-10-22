import { describe, expect, it } from "vitest";
import { CHIP, UNITS_PER_REM, bondWire, dieRect, legY, packageHeight } from "./chip";

const ends = (path: string) => {
  const numbers = path.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  return { start: numbers.slice(0, 2), end: numbers.slice(-2) };
};

describe("legY", () => {
  it("puts the legs at the centres of evenly spaced rows inside the package", () => {
    expect(legY(0)).toBeCloseTo(CHIP.inset + CHIP.row / 2);
    expect(legY(CHIP.pinsPerSide - 1)).toBeCloseTo(packageHeight() - CHIP.inset - CHIP.row / 2);
  });
});

describe("dieRect", () => {
  it("centres the die in the package", () => {
    const die = dieRect();
    expect(die.x * 2 + die.width).toBeCloseTo(CHIP.width);
    expect(die.y * 2 + die.height).toBeCloseTo(packageHeight());
  });
});

describe("bondWire", () => {
  it("runs from a pad on the die to the tip of its leg's finger, on the leg's own row", () => {
    const wire = bondWire("left", 2);
    const { start, end } = ends(wire.path);
    expect(start[0]).toBeCloseTo((wire.pad.x + CHIP.pad / 2) * UNITS_PER_REM, 0);
    expect(end).toEqual([+(CHIP.finger.length * UNITS_PER_REM).toFixed(1), +(legY(2) * UNITS_PER_REM).toFixed(1)]);
  });

  it("mirrors the right side onto the right edge", () => {
    const right = bondWire("right", 0);
    expect(right.finger.x + right.finger.width).toBeCloseTo(CHIP.width);
    expect(right.pad.x).toBeGreaterThan(bondWire("left", 0).pad.x);
  });
});
