import { describe, expect, it } from "vitest";
import { FEATURED } from "./featured";
import { PROJECTS } from "./projects";
import { REPLAYS, replayFor } from "./replays";

const SECTION_IDS = ["projects", "experience", "more-projects", "contact"];

describe("REPLAYS", () => {
  it("gives every More project a replay", () => {
    const featured = new Set(FEATURED.map((project) => project.repo));
    const missing = PROJECTS.filter((p) => !featured.has(p.repo) && !replayFor(p.repo)).map((p) => p.repo);
    expect(missing).toEqual([]);
  });

  it("uses ids that are unique and clash with no featured project or section", () => {
    const ids = REPLAYS.map((replay) => replay.id);
    const taken = new Set([...FEATURED.map((project) => project.id), ...SECTION_IDS]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter((id) => taken.has(id))).toEqual([]);
  });

  it("names only real repositories", () => {
    const repos = new Set(PROJECTS.map((project) => project.repo));
    expect(REPLAYS.filter((replay) => !repos.has(replay.repo)).map((replay) => replay.repo)).toEqual([]);
  });
});
