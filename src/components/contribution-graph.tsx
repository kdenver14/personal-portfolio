import type { CSSProperties } from "react";
import { CONTRIBUTIONS, LONGEST_STREAK } from "@/content/activity";
import { GITHUB_URL } from "@/content/profile";
import { type ContributionDay, type Streak, blinkRhythm, formatDay, monthLabels, toWeeks } from "@/lib/contributions";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

/** GitHub labels every other weekday row. */
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const LEVELS = [0, 1, 2, 3, 4];
/** A month label may run over this many week columns. */
const LABEL_SPAN = 3;

const count = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;

function dayTitle(day: ContributionDay): string {
  return `${count(day.count, "contribution")} on ${formatDay(day.date)}`;
}

/** A day's light: its on-and-off pattern, its speed, and a negative delay that starts it partway through. */
function DayCell({ day }: { day: ContributionDay }) {
  const { seconds, offset, pattern } = blinkRhythm(day.date);
  const rhythm: CSSVars = { "--blink": `${seconds.toFixed(2)}s`, "--blink-delay": `${(-offset).toFixed(2)}s` };
  return <span className="streak-cell" data-level={day.level} data-blink={pattern} title={dayTitle(day)} style={rhythm} />;
}

/** Just the streak's days, laid out in GitHub's week columns. */
function Chart({ days }: { days: readonly ContributionDay[] }) {
  const weeks = toWeeks(days);
  return (
    <div className="streak-chart" aria-hidden="true" style={{ "--weeks": String(weeks.length) } as CSSVars}>
      <div className="streak-months">
        {monthLabels(weeks).map((month) => (
          <span key={month.week} style={{ gridColumn: `${month.week + 1} / span ${LABEL_SPAN}` }}>
            {month.label}
          </span>
        ))}
      </div>
      <div className="streak-weekdays">
        {WEEKDAY_LABELS.map((label, i) => <span key={i}>{label}</span>)}
      </div>
      <div className="streak-grid">
        {weeks.flatMap((week, w) =>
          week.map((day, d) =>
            day ? (
              <DayCell key={day.date} day={day} />
            ) : (
              <span key={`${w}-${d}`} className="streak-cell is-blank" />
            ),
          ),
        )}
      </div>
    </div>
  );
}

function StreakFigure({ streak }: { streak: Streak }) {
  const days = CONTRIBUTIONS.days.filter((day) => day.date >= streak.start && day.date <= streak.end);
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const range = `${formatDay(streak.start)} – ${formatDay(streak.end)}`;
  return (
    <figure
      className="streak"
      aria-label={`Longest coding streak: ${streak.days} days in a row, ${range}, with ${count(total, "contribution")}.`}
    >
      <div className="streak-head">
        <p>
          Longest streak <strong className="tabular">{streak.days} days</strong> in a row
        </p>
        <p className="streak-dates">
          {range} · {count(total, "contribution")}
        </p>
      </div>
      <Chart days={days} />
      <figcaption className="streak-foot">
        <span>
          From{" "}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
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

/** The longest run of days with GitHub contributions, drawn as GitHub draws its calendar. */
export function ContributionGraph() {
  return LONGEST_STREAK ? <StreakFigure streak={LONGEST_STREAK} /> : <p className="detail-text">No contribution streak yet.</p>;
}
