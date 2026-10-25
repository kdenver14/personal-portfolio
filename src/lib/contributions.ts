/** GitHub contribution days: the longest streak, and GitHub's week-column layout for drawing it. */

import { seededRandom } from "./dot-field";

export interface ContributionDay {
  /** "YYYY-MM-DD". */
  readonly date: string;
  readonly count: number;
  /** GitHub's shade, 0 (none) to 4 (most). */
  readonly level: number;
}

export interface Streak {
  readonly days: number;
  readonly start: string;
  readonly end: string;
}

export interface MonthLabel {
  readonly week: number;
  readonly label: string;
}

export interface BlinkRhythm {
  /** One full cycle of the day's on-and-off pattern. */
  readonly seconds: number;
  /** How far into its cycle the day starts, so the lights are out of step from the first frame. */
  readonly offset: number;
  /** Which on-and-off pattern it follows, 1 to `BLINK_PATTERNS`. */
  readonly pattern: number;
}

const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
/** A month label needs this many week columns of room before the next one. */
const MIN_LABEL_WEEKS = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
/** The shortest and longest cycle of a day's on-and-off pattern, in seconds. */
const BLINK_MIN_SECONDS = 2;
const BLINK_MAX_SECONDS = 5;
/** How many on-and-off patterns the stylesheet defines (`streak-window-1` and on). */
export const BLINK_PATTERNS = 3;

const toTime = (date: string) => Date.parse(`${date}T00:00:00Z`);
const weekday = (date: string) => new Date(toTime(date)).getUTCDay();

/**
 * Each day's own on-and-off rhythm, so the streak flickers like a building's windows at night. Seeded by the
 * date, so the server and the browser draw the same rhythm.
 */
export function blinkRhythm(date: string): BlinkRhythm {
  const random = seededRandom(toTime(date) / MS_PER_DAY);
  const seconds = BLINK_MIN_SECONDS + random() * (BLINK_MAX_SECONDS - BLINK_MIN_SECONDS);
  return { seconds, offset: random() * seconds, pattern: 1 + Math.floor(random() * BLINK_PATTERNS) };
}

/** "Dec 5, 2025". */
export function formatDay(date: string): string {
  const day = new Date(toTime(date));
  return `${MONTHS[day.getUTCMonth()]} ${day.getUTCDate()}, ${day.getUTCFullYear()}`;
}

/** `run` grown by `date` when that is the next calendar day, else a fresh one-day run. */
function extend(run: Streak | null, date: string): Streak {
  return run && toTime(date) - toTime(run.end) === MS_PER_DAY
    ? { ...run, days: run.days + 1, end: date }
    : { days: 1, start: date, end: date };
}

/** The longest run of consecutive calendar days with at least one contribution; the latest wins a tie. */
export function longestStreak(days: readonly ContributionDay[]): Streak | null {
  let best: Streak | null = null;
  let run: Streak | null = null;
  for (const day of days) {
    run = day.count === 0 ? null : extend(run, day.date);
    if (run && (!best || run.days >= best.days)) {
      best = run;
    }
  }
  return best;
}

/** Week columns, Sunday first; days missing before the start or after the end are null. */
export function toWeeks(days: readonly ContributionDay[]): (ContributionDay | null)[][] {
  const first = days[0];
  if (!first) {
    return [];
  }
  const cells: (ContributionDay | null)[] = [...Array<null>(weekday(first.date)).fill(null), ...days];
  return Array.from({ length: Math.ceil(cells.length / DAYS_PER_WEEK) }, (_, week) =>
    Array.from({ length: DAYS_PER_WEEK }, (_, day) => cells[week * DAYS_PER_WEEK + day] ?? null),
  );
}

/** A month name over the first week that starts in it, skipping one that would crowd the next. */
export function monthLabels(weeks: readonly (readonly (ContributionDay | null)[])[]): MonthLabel[] {
  const starts = weeks.flatMap((week, index) => {
    const first = week.find((day) => day !== null);
    const previous = weeks[index - 1]?.find((day) => day !== null);
    const month = first ? new Date(toTime(first.date)).getUTCMonth() : null;
    const changed = month !== null && (!previous || new Date(toTime(previous.date)).getUTCMonth() !== month);
    return changed && month !== null ? [{ week: index, label: MONTHS[month] ?? "" }] : [];
  });
  return starts.filter((start, i) => (starts[i + 1]?.week ?? Infinity) - start.week >= MIN_LABEL_WEEKS);
}

export interface ContributionFile {
  readonly through: string;
  readonly days: readonly ContributionDay[];
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_LEVEL = 4;

function isDay(value: unknown): value is ContributionDay {
  const { date, count, level } = (value ?? {}) as Record<string, unknown>;
  return (
    typeof date === "string" && DATE.test(date) &&
    typeof count === "number" && Number.isInteger(count) && count >= 0 &&
    typeof level === "number" && Number.isInteger(level) && level >= 0 && level <= MAX_LEVEL
  );
}

/** Checks the snapshot written by scripts/fetch-contributions.mjs before the page trusts it. */
export function parseContributions(data: unknown): ContributionFile {
  const { through, days } = (data ?? {}) as Record<string, unknown>;
  if (typeof through !== "string" || !DATE.test(through) || !Array.isArray(days)) {
    throw new Error("Contribution file needs a `through` date and a `days` array");
  }
  const bad = days.findIndex((day) => !isDay(day));
  if (bad >= 0) {
    throw new Error(`Contribution day ${bad} is malformed`);
  }
  return { through, days: days as ContributionDay[] };
}
