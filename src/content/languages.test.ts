import { describe, expect, it } from "vitest";
import { LANGUAGES } from "./languages";

describe("LANGUAGES", () => {
  it("gives every language a positive share, together no more than the whole", () => {
    const total = LANGUAGES.reduce((sum, language) => sum + language.share, 0);
    expect(LANGUAGES.every((language) => language.share > 0)).toBe(true);
    expect(total).toBeLessThanOrEqual(100);
  });

  it("uses a distinct id per language, so each stop can be told apart", () => {
    const ids = LANGUAGES.map((language) => language.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
