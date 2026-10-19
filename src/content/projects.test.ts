import { describe, expect, it } from "vitest";
import type { Project } from "@/domain/datasheet";
import { projectByRepo } from "./projects";

const PROJECTS: readonly Project[] = [
  { repo: "a", name: "A", function: "Does A", language: "C++", created: "2024-03" },
];

describe("projectByRepo", () => {
  it("returns the project with the matching repo", () => {
    expect(projectByRepo("a", PROJECTS).name).toBe("A");
  });

  it("throws when the repo is not listed", () => {
    expect(() => projectByRepo("missing", PROJECTS)).toThrow(/missing/);
  });
});
