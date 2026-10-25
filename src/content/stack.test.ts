import { describe, expect, it } from "vitest";
import { STACK } from "./stack";

const ITEMS = STACK.flatMap((group) => group.items);
const NOTE_MAX = 50;

describe("STACK", () => {
  it("lists each technology once across all groups", () => {
    const names = ITEMS.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("keeps each note to one short sentence, so the caption fits on a line", () => {
    for (const { note } of ITEMS) {
      expect(note.length).toBeLessThanOrEqual(NOTE_MAX);
      expect(note).toMatch(/\.$/);
    }
  });
});
