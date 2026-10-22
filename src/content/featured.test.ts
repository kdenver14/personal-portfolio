import { describe, expect, it } from "vitest";
import samples from "../data/gesture-samples.json";
import { parseGestureFile } from "../lib/landmarks";
import { FEATURED } from "./featured";

const recorded = new Set(parseGestureFile(samples).map((set) => set.gesture));

describe("FEATURED demos", () => {
  it("sends the pipeline's create request and checks only through stops that exist", () => {
    for (const { demo } of FEATURED) {
      if (demo.kind !== "pipeline") {
        continue;
      }
      const exists = (stop: number) => stop >= 0 && stop < demo.stops.length;
      expect(demo.create.visits.every(exists)).toBe(true);
      expect(demo.create.visits).toContain(demo.create.answeredAt);
      for (const check of demo.checks) {
        expect(check.visits.every(exists)).toBe(true);
        expect(check.visits).toContain(check.resultAt);
      }
    }
  });

  it("only animates gestures that have recorded samples", () => {
    const gestures = FEATURED.flatMap(({ demo }) => (demo.kind === "gesture" ? demo.beats.map((beat) => beat.gesture) : []));
    expect(gestures.length).toBeGreaterThan(0);
    expect(gestures.filter((gesture) => !recorded.has(gesture))).toEqual([]);
  });
});
