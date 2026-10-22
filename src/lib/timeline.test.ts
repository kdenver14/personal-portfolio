import { describe, expect, it } from "vitest";
import { segmentAt } from "./timeline";

describe("segmentAt", () => {
  it("finds the segment and the time into it", () => {
    expect(segmentAt([100, 200], 150)).toEqual({ index: 1, elapsed: 50 });
  });

  it("holds the last segment's end once time runs past it", () => {
    expect(segmentAt([100, 200], 1_000)).toEqual({ index: 1, elapsed: 200 });
  });

  it("is null with no segments", () => {
    expect(segmentAt([], 0)).toBeNull();
  });
});
