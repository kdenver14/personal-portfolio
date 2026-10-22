import { describe, expect, it } from "vitest";
import { release } from "./pick";

describe("release", () => {
  it("clears the pick when it is the pin being left", () => {
    expect(release(3)(3)).toBeNull();
  });

  it("keeps a pick another pin made in the meantime", () => {
    expect(release(3)(7)).toBe(7);
  });
});
