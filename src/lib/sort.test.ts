import { describe, expect, it } from "vitest";
import type { SortRun } from "@/domain/datasheet";
import { sortAt, sortDuration, sortSteps } from "./sort";

const BUBBLE: SortRun = { algorithm: "bubble", file: "bubbleSort.cpp", values: [6, 4, 2, 5, 1, 3] };
const SELECTION: SortRun = { algorithm: "selection", file: "selectionSort.cpp", values: [6, 4, 2, 5, 1, 3] };

/** Applies the steps' swaps to the starting array. */
function finalOrder(run: SortRun): number[] {
  const values = [...run.values];
  for (const step of sortSteps(run)) {
    if (step.kind === "swap") {
      [values[step.a], values[step.b]] = [values[step.b] ?? 0, values[step.a] ?? 0];
    }
  }
  return values;
}

describe("sortSteps", () => {
  it("sorts the repo's arrays the way its programs print them", () => {
    expect(finalOrder(BUBBLE)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(finalOrder(SELECTION)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("compares every pair a bubble sort pass visits", () => {
    expect(sortSteps(BUBBLE).filter((step) => step.kind === "compare")).toHaveLength(15);
  });

  it("settles every slot exactly once", () => {
    for (const run of [BUBBLE, SELECTION]) {
      const settled = sortSteps(run).flatMap((step) => (step.kind === "settle" ? [step.slot] : []));
      expect([...settled].sort()).toEqual([0, 1, 2, 3, 4, 5]);
    }
  });
});

describe("sortAt", () => {
  it("starts unsorted and ends with the program's output", () => {
    expect(sortAt([BUBBLE], 0).slots).toEqual([0, 1, 2, 3, 4, 5]);
    const end = sortAt([BUBBLE], sortDuration([BUBBLE]));
    expect(end.done).toBe(true);
    expect(end.caption).toBe("1 2 3 4 5 6");
    expect(end.settled).toHaveLength(6);
  });

  it("moves two bars partway through a swap", () => {
    const steps = sortSteps(BUBBLE);
    expect(steps.slice(0, 2).map((step) => step.kind)).toEqual(["compare", "swap"]);
    const midSwap = sortAt([BUBBLE], 700 + 320 + 150);
    expect(midSwap.slots[0]).toBeCloseTo(0.5);
    expect(midSwap.slots[1]).toBeCloseTo(0.5);
    expect(midSwap.caption).toBe("6 > 4, swap");
  });

  it("plays runs back to back", () => {
    expect(sortAt([BUBBLE, SELECTION], sortDuration([BUBBLE]) + 1).run).toBe(1);
  });
});
