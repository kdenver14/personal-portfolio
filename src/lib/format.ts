const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function parseIsoMonth(isoMonth: string): { year: string; month: (typeof MONTHS)[number] } {
  const match = /^(\d{4})-(\d{2})$/.exec(isoMonth);
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  if (!match?.[1] || !month) {
    throw new RangeError(`Expected YYYY-MM, got "${isoMonth}"`);
  }
  return { year: match[1], month };
}

/** "2026-02" -> "February 2026". */
export function formatMonth(isoMonth: string): string {
  const { year, month } = parseIsoMonth(isoMonth);
  return `${month} ${year}`;
}

const SHORT_MONTH = 3;

function shortMonth(isoMonth: string): string {
  return parseIsoMonth(isoMonth).month.slice(0, SHORT_MONTH);
}

/** Inclusive month range, shortened where the parts repeat: "Dec 2025", "Jan – Feb 2026", "Dec 2025 – Feb 2026". */
export function formatMonthRange(start: string, end: string): string {
  const from = parseIsoMonth(start);
  const to = parseIsoMonth(end);
  if (start === end) {
    return `${shortMonth(start)} ${from.year}`;
  }
  if (from.year === to.year) {
    return `${shortMonth(start)} – ${shortMonth(end)} ${to.year}`;
  }
  return `${shortMonth(start)} ${from.year} – ${shortMonth(end)} ${to.year}`;
}

/** "2026-02" -> "2026". */
export function formatYear(isoMonth: string): string {
  return parseIsoMonth(isoMonth).year;
}

export function repoUrl(owner: string, repo: string): string {
  return `https://github.com/${owner}/${encodeURIComponent(repo)}`;
}
