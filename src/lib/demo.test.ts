import { describe, expect, it } from "vitest";
import type { CheckSample, DemoRequest, GestureBeat, OperatorBeat } from "@/domain/datasheet";
import { HOP_MS, gestureAt, modeBefore, operatorsAt, pipelineAt, pulseAt, requestPath, travelMs } from "./demo";

const created: DemoRequest = { method: "POST", path: "/monitors", visits: [0, 1, 2, 3, 4], answeredAt: 1, status: 201 };
const refused: DemoRequest = { method: "POST", path: "/monitors", visits: [0, 1], answeredAt: 1, status: 400 };

describe("requestPath", () => {
  it("goes out through every visit and back to the stop that answers", () => {
    expect(requestPath(created)).toEqual([0, 1, 2, 3, 4, 3, 2, 1]);
  });

  it("goes back past skipped stops the way it came", () => {
    expect(requestPath({ ...created, visits: [0, 2, 3, 5], answeredAt: 2 })).toEqual([0, 2, 3, 5, 3, 2]);
  });

  it("has no way back when the last stop answers", () => {
    expect(requestPath(refused)).toEqual([0, 1]);
  });
});

describe("pulseAt", () => {
  it("eases between stops and takes longer to skip one", () => {
    expect(pulseAt([0, 1], HOP_MS / 2).at).toBeCloseTo(0.5);
    expect(travelMs([0, 2])).toBe(2 * HOP_MS);
    expect(pulseAt([0, 2], 2 * HOP_MS)).toEqual({ at: 2, reached: 2 });
  });
});

describe("pipelineAt", () => {
  const create: DemoRequest = { method: "POST", path: "/monitors", visits: [0, 1], answeredAt: 0, status: 201 };
  const up: CheckSample = { visits: [1, 2, 3], resultAt: 3, isUp: true, statusCode: 200, responseTime: 143 };
  const down: CheckSample = { visits: [1, 2, 3, 4], resultAt: 3, isUp: false, statusCode: null, failure: "timed out" };

  it("creates the monitor before any check", () => {
    expect(pipelineAt(create, [up], 0)).toMatchObject({ check: null, pulse: null, answered: false });
    expect(pipelineAt(create, [up], 600 + 2 * HOP_MS)).toMatchObject({ check: null, lit: [0, 1], answered: true });
  });

  it("shows a check's result once the job reaches the checker, while it goes on to alerts", () => {
    const createMs = 600 + 2 * HOP_MS + 1900;
    const atChecker = pipelineAt(create, [down], createMs + 600 + 2 * HOP_MS + 1);
    expect(atChecker).toMatchObject({ check: 0, answered: true });
    expect(atChecker.pulse).not.toBeNull();
    expect(pipelineAt(create, [down], 60_000)).toMatchObject({ check: 0, lit: [1, 2, 3, 4], pulse: null, answered: true });
  });

  it("plays checks back to back", () => {
    expect(pipelineAt(create, [up, down], 60_000).check).toBe(1);
  });
});

describe("gestureAt", () => {
  const openHand: GestureBeat = { gesture: "open_hand", mode: "DRAW", action: "lift pen" };
  const peace: GestureBeat = { gesture: "peace", mode: "VOLUME", action: "set volume" };
  const beats = [openHand, peace];

  it("starts each beat from the previous pose and ends with every stop reached", () => {
    expect(gestureAt(beats, 5, 0)).toMatchObject({ index: 0, blend: 0, pulse: null, reached: 0 });
    expect(gestureAt(beats, 5, 60_000)).toMatchObject({ index: 1, blend: 1, pulse: null, reached: 5 });
  });

  it("reads the mode a beat starts in from the beat before it", () => {
    expect(modeBefore(beats, 0, "DRAW")).toBe("DRAW");
    expect(modeBefore(beats, 1, "DRAW")).toBe("DRAW");
    expect(modeBefore([...beats, openHand], 2, "DRAW")).toBe("VOLUME");
  });
});

describe("operatorsAt", () => {
  const beats: OperatorBeat[] = [
    { expression: "a + b", signature: "Int operator+(…)", result: "15" },
    { expression: "a += b", signature: "Int& operator+=(…)", result: "15", a: 15 },
  ];

  it("shows a line before the value it prints", () => {
    expect(operatorsAt(10, beats, 3, 0)).toMatchObject({ step: { kind: "operator", index: 0 }, showResult: false, a: 10 });
    expect(operatorsAt(10, beats, 3, 400)).toMatchObject({ showResult: true, changed: false, a: 10 });
  });

  it("changes a only once a compound assignment has run", () => {
    expect(operatorsAt(10, beats, 3, 750)).toMatchObject({ step: { kind: "operator", index: 1 }, a: 10, changed: false });
    expect(operatorsAt(10, beats, 3, 1100)).toMatchObject({ a: 15, changed: true });
  });

  it("allocates the heap Ints, then frees one per recursive call", () => {
    expect(operatorsAt(10, beats, 3, 1500)).toMatchObject({ allocated: true, freed: 0, step: { kind: "delete", call: 0 } });
    expect(operatorsAt(10, beats, 3, 2200)).toMatchObject({ freed: 1, step: { kind: "delete", call: 0 } });
    expect(operatorsAt(10, beats, 3, 60_000)).toMatchObject({ a: 15, freed: 3, pulse: null, step: { kind: "delete", call: 2 } });
  });
});
