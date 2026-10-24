import { describe, expect, it } from "vitest";
import { logoNamed } from "./logos";
import { TECH } from "./tech";

describe("logoNamed", () => {
  it("returns the logo for a known technology", () => {
    const logo = logoNamed("React");
    expect(logo.name).toBe("React");
    expect(logo.viewBox).toMatch(/^\d+ \d+ \d+ \d+$/);
    expect(logo.path.length).toBeGreaterThan(0);
  });

  it("throws for a technology with no logo", () => {
    expect(() => logoNamed("Zustand")).toThrow(/Zustand/);
  });
});

describe("TECH", () => {
  it("names each technology on the strip once", () => {
    const names = TECH.map((tech) => tech.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
