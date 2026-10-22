import { describe, expect, it } from "vitest";
import type { Replay } from "@/domain/datasheet";
import { FEATURED } from "./featured";
import { PROJECTS } from "./projects";
import { REPLAYS, replayFor } from "./replays";

const SECTION_IDS = ["projects", "experience", "activity", "more-projects", "contact"];
const featured = new Set(FEATURED.map((project) => project.repo));
const more = PROJECTS.filter((project) => !featured.has(project.repo)).map((project) => project.repo);

describe("REPLAYS", () => {
  it("gives every More project a replay", () => {
    expect(more.filter((repo) => !REPLAYS.some((replay) => replay.repo === repo))).toEqual([]);
  });

  it("has no replay for a repo outside More projects", () => {
    expect(REPLAYS.map((replay) => replay.repo).filter((repo) => !more.includes(repo))).toEqual([]);
  });

  it("uses ids that are unique and clash with no featured project or section", () => {
    const ids = REPLAYS.map((replay) => replay.id);
    const taken = new Set([...FEATURED.map((project) => project.id), ...SECTION_IDS]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter((id) => taken.has(id))).toEqual([]);
  });
});

describe("replayFor", () => {
  const replay: Replay = { id: "a", repo: "repo-a", kind: "pong", title: "A", description: "Plays A.", seconds: 1, speed: 1 };

  it("returns the replay for the repo", () => {
    expect(replayFor("repo-a", [replay])).toBe(replay);
  });

  it("throws when the repo has no replay", () => {
    expect(() => replayFor("missing", [replay])).toThrow(/missing/);
  });
});
