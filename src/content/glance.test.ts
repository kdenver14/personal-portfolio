import { describe, expect, it } from "vitest";
import { LANGUAGE_SHARES, WEB_SHARE, proofFor } from "./glance";

describe("LANGUAGE_SHARES", () => {
  it("adds up to the whole with the web share, give or take rounding each share to a whole percent", () => {
    const total = LANGUAGE_SHARES.reduce((sum, language) => sum + language.share, WEB_SHARE);
    expect(Math.abs(total - 100)).toBeLessThanOrEqual(1);
  });

  it("runs largest share first, so the bar reads left to right", () => {
    const shares = LANGUAGE_SHARES.map((language) => language.share);
    expect(shares).toEqual([...shares].sort((a, b) => b - a));
  });

  it("names a project for every language, each one resolvable", () => {
    for (const language of LANGUAGE_SHARES) {
      expect(language.repos.length).toBeGreaterThan(0);
      expect(() => language.repos.map(proofFor)).not.toThrow();
    }
  });
});

describe("proofFor", () => {
  it("opens the project's pop-up when it has one on this page", () => {
    expect(proofFor("uptime-monitor")).toEqual({ name: "uptime-monitor", href: "#uptime-monitor", external: false });
    expect(proofFor("pong-game")).toEqual({ name: "Pong", href: "#pong", external: false });
  });

  it("links to GitHub for a repo with no row on this page", () => {
    expect(proofFor("Game-Store")).toEqual({ name: "Game Store", href: "https://github.com/kdenver14/Game-Store", external: true });
  });

  it("throws for a repo it knows nothing about", () => {
    expect(() => proofFor("not-a-repo")).toThrow(/not-a-repo/);
  });
});
