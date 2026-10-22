import { describe, expect, it } from "vitest";
import { daylight, isNight, orthographic, subsolarPoint, toVector } from "./globe";

const MANILA = { lon: 121, lat: 14.6 };

describe("subsolarPoint", () => {
  it("puts the sun over the Greenwich meridian at noon UTC, and over 180° at midnight", () => {
    expect(subsolarPoint(new Date(Date.UTC(2026, 9, 23, 12))).lon).toBeCloseTo(0);
    expect(subsolarPoint(new Date(Date.UTC(2026, 9, 23, 0))).lon).toBeCloseTo(180);
  });

  it("follows the seasons: near the equator at an equinox, near the Tropic of Cancer at the June solstice", () => {
    expect(Math.abs(subsolarPoint(new Date(Date.UTC(2026, 2, 20, 12))).lat)).toBeLessThan(1.5);
    expect(subsolarPoint(new Date(Date.UTC(2026, 5, 21, 12))).lat).toBeGreaterThan(23);
  });
});

describe("isNight", () => {
  it("is day in Manila at noon there and night at 10 pm there", () => {
    expect(isNight(MANILA, new Date(Date.UTC(2026, 9, 23, 4)))).toBe(false);
    expect(isNight(MANILA, new Date(Date.UTC(2026, 9, 23, 14)))).toBe(true);
  });
});

describe("daylight", () => {
  it("is full under the sun, none on the far side, and half on the terminator", () => {
    const sun = toVector({ lon: 0, lat: 0 });
    expect(daylight(sun, sun)).toBe(1);
    expect(daylight(toVector({ lon: 180, lat: 0 }), sun)).toBe(0);
    expect(daylight(toVector({ lon: 90, lat: 0 }), sun)).toBeCloseTo(0.5);
  });
});

describe("orthographic", () => {
  it("puts the view's centre in the middle, facing the viewer", () => {
    const p = orthographic(MANILA, MANILA);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(0);
    expect(p.z).toBeCloseTo(1);
  });

  it("puts a place 90° east on the right edge and one north above the centre", () => {
    const east = orthographic({ lon: 90, lat: 0 }, { lon: 0, lat: 0 });
    expect(east.x).toBeCloseTo(1);
    expect(east.z).toBeCloseTo(0);
    expect(orthographic({ lon: 0, lat: 30 }, { lon: 0, lat: 0 }).y).toBeLessThan(0);
  });
});
