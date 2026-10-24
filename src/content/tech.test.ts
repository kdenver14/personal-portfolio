import { describe, expect, it } from "vitest";
import { TECH } from "./tech";

describe("TECH", () => {
  it("names each technology once", () => {
    const names = TECH.map((tech) => tech.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every logo a four-number viewBox and a path to draw", () => {
    for (const tech of TECH) {
      expect(tech.viewBox).toMatch(/^\d+ \d+ \d+ \d+$/);
      expect(tech.path.length).toBeGreaterThan(0);
    }
  });
});
