import { describe, expect, it } from "vitest";
import { routeTrace } from "./traces";

describe("routeTrace", () => {
  it("joins the points into one moveto followed by linetos", () => {
    expect(routeTrace([[0, 56], [92, 56], [124, 88], [124, 200]]).d).toBe("M0 56L92 56L124 88L124 200");
  });

  it("ends on the last point, where the pad goes", () => {
    expect(routeTrace([[56, 0], [56, 12], [80, 36]]).end).toEqual([80, 36]);
  });

  it("throws when a segment is not horizontal, vertical or 45°", () => {
    expect(() => routeTrace([[0, 0], [10, 20]])).toThrow(RangeError);
  });

  it("throws when a segment has no length", () => {
    expect(() => routeTrace([[0, 0], [0, 0]])).toThrow(RangeError);
  });

  it("throws when the trace has fewer than two points", () => {
    expect(() => routeTrace([[0, 0]])).toThrow(RangeError);
  });
});
