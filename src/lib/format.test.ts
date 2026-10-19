import { describe, expect, it } from "vitest";
import { formatMonth, formatMonthRange, formatYear, repoUrl } from "./format";

describe("formatMonth", () => {
  it("spells out an ISO month", () => {
    expect(formatMonth("2026-02")).toBe("February 2026");
  });

  it("throws when the month is out of range", () => {
    expect(() => formatMonth("2026-13")).toThrow(RangeError);
  });
});

describe("formatYear", () => {
  it("returns the year of an ISO month", () => {
    expect(formatYear("2024-03")).toBe("2024");
  });

  it("throws on a malformed month", () => {
    expect(() => formatYear("March 2024")).toThrow(RangeError);
  });
});

describe("formatMonthRange", () => {
  it("shows a single month once", () => {
    expect(formatMonthRange("2025-12", "2025-12")).toBe("Dec 2025");
  });

  it("names the year once when both months share it", () => {
    expect(formatMonthRange("2026-01", "2026-02")).toBe("Jan – Feb 2026");
  });

  it("keeps both years when the range crosses one", () => {
    expect(formatMonthRange("2025-12", "2026-02")).toBe("Dec 2025 – Feb 2026");
  });

  it("throws on a malformed month", () => {
    expect(() => formatMonthRange("2026-1", "2026-02")).toThrow(RangeError);
  });
});

describe("repoUrl", () => {
  it("encodes the repo segment", () => {
    expect(repoUrl("kdenver14", "a b")).toBe("https://github.com/kdenver14/a%20b");
  });
});
