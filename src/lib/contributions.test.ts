import { describe, expect, it } from "vitest";
import { BLINK_PATTERNS, type ContributionDay, blinkRhythm, formatDay, longestStreak, monthLabels, parseContributions, toWeeks } from "./contributions";

const day = (date: string, count: number): ContributionDay => ({ date, count, level: count > 0 ? 1 : 0 });

describe("longestStreak", () => {
  it("finds the longest run of days with contributions", () => {
    const days = [day("2026-01-01", 1), day("2026-01-02", 3), day("2026-01-03", 0), day("2026-01-04", 1), day("2026-01-05", 2), day("2026-01-06", 1)];
    expect(longestStreak(days)).toEqual({ days: 3, start: "2026-01-04", end: "2026-01-06" });
  });

  it("breaks a run at a missing calendar day", () => {
    expect(longestStreak([day("2026-01-01", 1), day("2026-01-03", 1)])?.days).toBe(1);
  });

  it("is null with no contributions", () => {
    expect(longestStreak([day("2026-01-01", 0)])).toBeNull();
  });
});

describe("toWeeks", () => {
  it("pads the first week so each column runs Sunday to Saturday", () => {
    const weeks = toWeeks([day("2026-10-21", 1), day("2026-10-22", 2)]);
    expect(weeks).toHaveLength(1);
    expect(weeks[0]?.slice(0, 3)).toEqual([null, null, null]);
    expect(weeks[0]?.[3]?.date).toBe("2026-10-21");
  });
});

describe("monthLabels", () => {
  it("labels the first week of each month and drops one that would crowd the next", () => {
    const days = Array.from({ length: 70 }, (_, i) => day(new Date(Date.UTC(2026, 0, 25) + i * 86_400_000).toISOString().slice(0, 10), 0));
    expect(monthLabels(toWeeks(days)).map((m) => m.label)).toEqual(["Feb", "Mar"]);
  });
});

describe("blinkRhythm", () => {
  const dates = Array.from({ length: 60 }, (_, i) => new Date(Date.UTC(2025, 11, 5) + i * 86_400_000).toISOString().slice(0, 10));

  it("gives a day the same rhythm on every call", () => {
    expect(blinkRhythm("2025-12-05")).toEqual(blinkRhythm("2025-12-05"));
  });

  it("keeps every cycle between 2 s and 5 s, starting somewhere inside itself", () => {
    for (const date of dates) {
      const { seconds, offset } = blinkRhythm(date);
      expect(seconds).toBeGreaterThanOrEqual(2);
      expect(seconds).toBeLessThanOrEqual(5);
      expect(offset).toBeGreaterThanOrEqual(0);
      expect(offset).toBeLessThan(seconds);
    }
  });

  it("uses every pattern the stylesheet defines, and no other", () => {
    const patterns = new Set(dates.map((date) => blinkRhythm(date).pattern));
    expect([...patterns].sort()).toEqual(Array.from({ length: BLINK_PATTERNS }, (_, i) => i + 1));
  });

  it("gives neighbouring days different rhythms, so the lights fall out of step", () => {
    const periods = new Set(dates.map((date) => blinkRhythm(date).seconds.toFixed(3)));
    expect(periods.size).toBeGreaterThan(dates.length * 0.8);
  });
});

describe("formatDay", () => {
  it("reads like a short date", () => {
    expect(formatDay("2025-12-05")).toBe("Dec 5, 2025");
  });
});

describe("parseContributions", () => {
  it("accepts a well-formed snapshot", () => {
    const file = { through: "2026-10-22", days: [day("2026-10-22", 4)] };
    expect(parseContributions(file)).toEqual(file);
  });

  it("rejects a day with a bad level", () => {
    expect(() => parseContributions({ through: "2026-10-22", days: [{ date: "2026-10-22", count: 1, level: 9 }] })).toThrow();
  });
});
