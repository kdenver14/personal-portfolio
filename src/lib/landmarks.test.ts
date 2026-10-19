import { describe, expect, it } from "vitest";
import type { GestureSet } from "@/domain/datasheet";
import { meanPose, parseGestureFile, project, sharedDomain } from "./landmarks";

const set = (samples: GestureSet["samples"]): GestureSet => ({ gesture: "t", recorded: samples.length, samples });

describe("sharedDomain", () => {
  it("spans every set and adds padding on each side", () => {
    const domain = sharedDomain([set([[[0, 0], [1, -1]]]), set([[[-2, 0.5]]])], 0.5);
    expect(domain).toEqual({ xMin: -2.5, xMax: 1.5, yMin: -1.5, yMax: 1 });
  });

  it("throws when there are no landmarks", () => {
    expect(() => sharedDomain([], 0)).toThrow();
  });
});

describe("meanPose", () => {
  it("averages each landmark across samples", () => {
    expect(meanPose([[[0, 0], [2, 2]], [[2, 4], [4, 6]]])).toEqual([[1, 2], [3, 4]]);
  });
});

describe("project", () => {
  it("maps the domain corners onto the viewport corners", () => {
    const domain = { xMin: -1, xMax: 1, yMin: -2, yMax: 0 };
    expect(project([-1, -2], domain, 100, 200)).toEqual([0, 0]);
    expect(project([1, 0], domain, 100, 200)).toEqual([100, 200]);
  });
});

describe("parseGestureFile", () => {
  it("accepts well-formed gesture sets", () => {
    const file = { gestures: [{ gesture: "fist", recorded: 200, samples: [[[0, 0], [0.1, -0.2]]] }] };
    expect(parseGestureFile(file)).toEqual(file.gestures);
  });

  it("rejects a sample with a non-numeric coordinate", () => {
    const file = { gestures: [{ gesture: "fist", recorded: 1, samples: [[[0, "x"]]] }] };
    expect(() => parseGestureFile(file)).toThrow("malformed");
  });
});
