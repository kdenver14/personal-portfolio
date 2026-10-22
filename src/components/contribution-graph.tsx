import type { CSSProperties } from "react";
import data from "@/data/contributions.json";
import { GITHUB_URL } from "@/content/profile";
import {
  type ContributionDay,
  formatDay,
  lastYear,
  longestStreak,
  monthLabels,
  parseContributions,
  toWeeks,
  weekOf,
} from "@/lib/contributions";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const FILE = parseContributions(data);
const WINDOW = lastYear(FILE.days, FILE.through);
const WEEKS = toWeeks(WINDOW);
const MONTHS = monthLabels(WEEKS);
const STREAK = longestStreak(FILE.days);
const TOTAL = WINDOW.reduce((sum, day) => sum + day.count, 0);
const FIRST_SHOWN = WINDOW[0]?.date ?? FILE.through;
/** GitHub labels every other weekday row. */
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const LEVELS = [0, 1, 2, 3, 4];
/** A month label may run over this many week columns. */
const LABEL_SPAN = 3;

const count = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;

function dayTitle(day: ContributionDay): string {
  return `${day.count === 0 ? "No contributions" : count(day.count, "contribution")} on ${formatDay(day.date)}`;
}

/** The bracket under the longest streak, when it falls inside the year shown. */
function StreakRange() {
  if (!STREAK || STREAK.end < FIRST_SHOWN) {
    return null;
  }
  const start = Math.max(0, weekOf(STREAK.start, FIRST_SHOWN));
  const end = weekOf(STREAK.end, FIRST_SHOWN);
  return (
    <div className="streak-under">
      <span className="streak-range" style={{ gridColumn: `${start + 1} / ${end + 2}` }}>
        {STREAK.days}-day streak
      </span>
    </div>
  );
}

function Chart() {
  return (
    <div className="streak-chart" aria-hidden="true" style={{ "--weeks": String(WEEKS.length) } as CSSVars}>
      <div className="streak-months">
        {MONTHS.map((month) => (
          <span key={month.week} style={{ gridColumn: `${month.week + 1} / span ${LABEL_SPAN}` }}>
            {month.label}
          </span>
        ))}
      </div>
      <div className="streak-weekdays">
        {WEEKDAY_LABELS.map((label, i) => <span key={i}>{label}</span>)}
      </div>
      <div className="streak-grid">
        {WEEKS.flatMap((week, w) =>
          week.map((day, d) =>
            day ? (
              <span key={day.date} className="streak-cell" data-level={day.level} title={dayTitle(day)} />
            ) : (
              <span key={`${w}-${d}`} className="streak-cell is-blank" />
            ),
          ),
        )}
      </div>
      <StreakRange />
    </div>
  );
}

/** A GitHub-style contribution calendar for the last year, with the longest streak marked. */
export function ContributionGraph() {
  const summary = STREAK
    ? `${count(TOTAL, "contribution")} in the last year. Longest streak: ${STREAK.days} days, ${formatDay(STREAK.start)} to ${formatDay(STREAK.end)}.`
    : `${count(TOTAL, "contribution")} in the last year.`;
  return (
    <figure className="streak" aria-label={summary}>
      <div className="streak-head">
        <p>
          <strong className="tabular">{TOTAL.toLocaleString("en-US")}</strong> contributions in the last year
        </p>
        {STREAK ? (
          <p>
            Longest streak <strong className="tabular">{STREAK.days} days</strong>
            <span className="streak-dates">
              {formatDay(STREAK.start)} – {formatDay(STREAK.end)}
            </span>
          </p>
        ) : null}
      </div>
      <Chart />
      <figcaption className="streak-foot">
        <span>
          From{" "}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          , through {formatDay(FILE.through)}
        </span>
        <span className="streak-legend" aria-hidden="true">
          Less
          {LEVELS.map((level) => <span key={level} className="streak-cell" data-level={level} />)}
          More
        </span>
      </figcaption>
    </figure>
  );
}
