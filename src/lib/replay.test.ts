import { describe, expect, it } from "vitest";
import type { TerminalStep, WindowState, WindowStep } from "@/domain/datasheet";
import { PONG, PONG_START, TYPE_MS, pongAt, pongStep, replayDuration, terminalAt, windowAt } from "./replay";

const TERMINAL: TerminalStep[] = [{ cmd: "ls" }, { out: "a.txt" }, { note: "done" }];

describe("terminalAt", () => {
  it("types a command one character at a time", () => {
    const frame = terminalAt(TERMINAL, TYPE_MS);
    expect(frame.lines).toEqual([{ kind: "cmd", text: "l", tone: "plain" }]);
    expect(frame.typing).toBe(true);
  });

  it("prints output after the command, then notes, in order", () => {
    const frame = terminalAt(TERMINAL, 60_000);
    expect(frame.lines.map((line) => [line.kind, line.text])).toEqual([["cmd", "ls"], ["out", "a.txt"], ["note", "done"]]);
    expect(frame.typing).toBe(false);
  });

  it("shows nothing before the replay starts typing", () => {
    expect(terminalAt([{ wait: 500 }, { out: "late" }], 100).lines).toEqual([]);
  });
});

describe("windowAt", () => {
  const initial: WindowState = { heading: "Todo", fields: [{ value: "" }], items: [{ text: "Milk" }] };
  const steps: WindowStep[] = [{ type: "Eggs" }, { set: { items: [{ text: "Milk" }, { text: "Eggs" }] } }, { append: "!", item: 0 }];

  it("types into the field and focuses it", () => {
    const frame = windowAt(initial, steps, 2 * TYPE_MS);
    expect(frame.state.fields?.[0]?.value).toBe("Eg");
    expect(frame.focus).toEqual({ field: 0 });
  });

  it("applies a patch and drops the focus", () => {
    const frame = windowAt(initial, steps.slice(0, 2), 60_000);
    expect(frame.state.items).toEqual([{ text: "Milk" }, { text: "Eggs" }]);
    expect(frame.focus).toBeNull();
  });

  it("appends to a list item without losing its text", () => {
    expect(windowAt(initial, steps, 60_000).state.items?.[0]?.text).toBe("Milk!");
  });
});

describe("replayDuration", () => {
  it("ends exactly when the last step does", () => {
    const replay = { id: "t", repo: "r", title: "t", description: "d", kind: "terminal", steps: TERMINAL } as const;
    const end = replayDuration(replay);
    expect(terminalAt(TERMINAL, end - 1).lines).toHaveLength(3);
    expect(end).toBeGreaterThan(2 * TYPE_MS);
  });
});

describe("pong", () => {
  it("bounces off the top wall", () => {
    const next = pongStep({ ...PONG_START, y: PONG.wall, dy: PONG.ballStep });
    expect(next.dy).toBe(-PONG.ballStep);
  });

  it("returns the ball off a paddle and speeds up", () => {
    const next = pongStep({ ...PONG_START, x: PONG.hitX + 5, y: 0, dy: 0, right: 0 });
    expect(next.dx).toBe(-PONG.ballStep);
    expect(next.tick).toBeCloseTo(PONG.startTick * PONG.speedUp);
  });

  it("scores for the other side when the ball gets past a paddle", () => {
    const next = pongStep({ ...PONG_START, x: PONG.outX, y: 250, dy: 0, right: -250 });
    expect(next.score).toEqual([1, 0]);
    expect([next.x, next.y]).toEqual([0, 0]);
  });

  it("is the same game every time", () => {
    expect(pongAt(20_000)).toEqual(pongAt(20_000));
  });
});
