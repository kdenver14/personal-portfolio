import { describe, expect, it } from "vitest";
import { CODE_SAMPLES } from "./code-samples";
import { PROJECTS } from "./projects";

describe("CODE_SAMPLES", () => {
  it("notes only lines that are in the excerpt, in order", () => {
    for (const sample of CODE_SAMPLES) {
      const count = sample.source.split("\n").length;
      const starts = sample.notes.map((note) => note.from);
      expect(sample.notes.every((note) => note.from >= 1 && note.from <= note.to && note.to <= count)).toBe(true);
      expect(starts).toEqual(starts.toSorted((a, b) => a - b));
    }
  });

  it("starts each note on its own line, so every margin number is visible", () => {
    for (const sample of CODE_SAMPLES) {
      const starts = sample.notes.map((note) => note.from);
      expect(new Set(starts).size).toBe(starts.length);
    }
  });

  it("quotes only repos that appear on the page", () => {
    const repos = new Set(PROJECTS.map((project) => project.repo));
    expect(CODE_SAMPLES.filter((sample) => !repos.has(sample.repo)).map((sample) => sample.repo)).toEqual([]);
  });
});
