import { describe, expect, it } from "vitest";
import { logoNamed } from "./logos";
import { STACK } from "./stack";

const ITEMS = STACK.flatMap((group) => group.items);
const NOTE_MAX = 50;
const MONOGRAM_LENGTH = 2;

describe("STACK", () => {
  it("lists each technology once across all groups", () => {
    const names = ITEMS.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("draws every logo it names, and keeps monograms to two letters", () => {
    for (const { mark } of ITEMS) {
      if (mark.kind === "logo") {
        expect(() => logoNamed(mark.name)).not.toThrow();
      } else {
        expect(mark.text).toHaveLength(MONOGRAM_LENGTH);
      }
    }
  });

  it("keeps each note to one short sentence, so the caption fits on a line", () => {
    for (const { note } of ITEMS) {
      expect(note.length).toBeLessThanOrEqual(NOTE_MAX);
      expect(note).toMatch(/\.$/);
    }
  });
});
