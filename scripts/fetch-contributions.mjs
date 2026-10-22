// Builds src/data/contributions.json from the public GitHub contribution calendar of OWNER: one entry per
// day since FIRST_YEAR, with GitHub's count and its 0–4 shade level.
//
// Usage: node scripts/fetch-contributions.mjs            refresh the snapshot; fails on any error
//        node scripts/fetch-contributions.mjs --vercel   as a prebuild step: refreshes only on Vercel, and
//                                                        keeps the committed snapshot if GitHub can't be read

import { writeFile } from "node:fs/promises";

const OWNER = "kdenver14";
/** The year of the account's first contribution; earlier years are empty. */
const FIRST_YEAR = 2022;
const OUTPUT_PATH = "src/data/contributions.json";
/** A full last-year calendar has 365–371 days; far fewer means GitHub's markup changed under the parser. */
const MIN_LAST_YEAR_DAYS = 360;

const CELL = /<td[^>]*?data-date="(\d{4}-\d{2}-\d{2})"[^>]*?id="([^"]+)"[^>]*?data-level="(\d)"/g;
const TOOLTIP = /<tool-tip[^>]*?for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;
const COUNT = /^(\d+) contributions? on /;

const calendarUrl = (query) => `https://github.com/users/${OWNER}/contributions${query}`;

async function fetchCalendar(query) {
  const response = await fetch(calendarUrl(query), { headers: { accept: "text/html" } });
  if (!response.ok) {
    throw new Error(`GitHub answered ${response.status} for ${calendarUrl(query)}`);
  }
  return response.text();
}

/** Every day cell in one calendar page, with its count read from the cell's tooltip. */
function parseCalendar(html) {
  const tips = new Map([...html.matchAll(TOOLTIP)].map(([, id, text]) => [id, text]));
  return [...html.matchAll(CELL)].map(([, date, id, level]) => ({
    date,
    count: Number(COUNT.exec(tips.get(id) ?? "")?.[1] ?? 0),
    level: Number(level),
  }));
}

async function collect() {
  const years = Array.from({ length: new Date().getUTCFullYear() - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);
  const [lastYear, ...byYear] = await Promise.all([
    fetchCalendar(""),
    ...years.map((year) => fetchCalendar(`?from=${year}-01-01&to=${year}-12-31`)),
  ]).then((pages) => pages.map(parseCalendar));
  if (lastYear.length < MIN_LAST_YEAR_DAYS) {
    throw new Error(`Read only ${lastYear.length} days from the last-year calendar; the page format may have changed`);
  }
  const through = lastYear.map((day) => day.date).sort().at(-1);
  const days = new Map([...byYear.flat(), ...lastYear].map((day) => [day.date, day]));
  return {
    through,
    days: [...days.values()].filter((day) => day.date <= through).sort((a, b) => a.date.localeCompare(b.date)),
  };
}

const asPrebuild = process.argv.includes("--vercel");
if (asPrebuild && !process.env.VERCEL) {
  console.log("contributions: not on Vercel, keeping the committed snapshot");
} else {
  try {
    const data = await collect();
    await writeFile(OUTPUT_PATH, `${JSON.stringify(data)}\n`);
    console.log(`contributions: wrote ${data.days.length} days through ${data.through} to ${OUTPUT_PATH}`);
  } catch (error) {
    if (!asPrebuild) {
      throw error;
    }
    // A GitHub hiccup must not block a deploy: say so in the build log and ship the committed snapshot.
    console.warn(`contributions: could not refresh (${error.message}); keeping the committed snapshot`);
  }
}
