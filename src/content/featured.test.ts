import { describe, expect, it } from "vitest";
import samples from "../data/gesture-samples.json";
import { parseGestureFile } from "../lib/landmarks";
import { FEATURED } from "./featured";

const recorded = new Set(parseGestureFile(samples).map((set) => set.gesture));

describe("FEATURED demos", () => {
  it("routes every request through stops that exist, and answers from one it visited", () => {
    for (const { demo } of FEATURED) {
      if (demo.kind !== "requests") {
        continue;
      }
      for (const request of demo.requests) {
        expect(request.visits.every((stop) => stop >= 0 && stop < demo.stops.length)).toBe(true);
        expect(request.visits).toContain(request.answeredAt);
      }
    }
  });

  it("only animates gestures that have recorded samples", () => {
    const gestures = FEATURED.flatMap(({ demo }) => (demo.kind === "gesture" ? demo.beats.map((beat) => beat.gesture) : []));
    expect(gestures.length).toBeGreaterThan(0);
    expect(gestures.filter((gesture) => !recorded.has(gesture))).toEqual([]);
  });
});
