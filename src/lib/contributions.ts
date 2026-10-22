/** GitHub contribution days: the last-year window GitHub draws, its week columns, and the longest streak. */

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

const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
const DAYS_PER_YEAR = 365;
/** A month label needs this many week columns of room before the next one. */
const MIN_LABEL_WEEKS = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

const toTime = (date: string) => Date.parse(`${date}T00:00:00Z`);
const toDate = (time: number) => new Date(time).toISOString().slice(0, 10);
const weekday = (date: string) => new Date(toTime(date)).getUTCDay();

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

/** GitHub's last-year view: from the Sunday on or before a year ago, through `through`. */
export function lastYear(days: readonly ContributionDay[], through: string): ContributionDay[] {
  const yearAgo = toDate(toTime(through) - DAYS_PER_YEAR * MS_PER_DAY);
  const start = toDate(toTime(yearAgo) - weekday(yearAgo) * MS_PER_DAY);
  return days.filter((day) => day.date >= start && day.date <= through);
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

/** Which week column holds `date`, given the first day shown. */
export function weekOf(date: string, first: string): number {
  return Math.floor(((toTime(date) - toTime(first)) / MS_PER_DAY + weekday(first)) / DAYS_PER_WEEK);
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
