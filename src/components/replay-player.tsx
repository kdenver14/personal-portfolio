"use client";

import type { Replay, TerminalStep, WindowState, WindowStep } from "@/domain/datasheet";
import { type WindowFocus, PONG, pongAt, replayDuration, terminalAt, windowAt } from "@/lib/replay";
import { useProjectOpen } from "./project-dialog";
import { CONTROL_LABEL, usePlayback } from "./use-playback";

const PROMPT = { cmd: "$ ", note: "# ", out: "" } as const;
/** Pong court in turtle units, y up; the SVG flips y. */
const COURT = { width: 800, height: 600, paddle: { width: 20, height: 100 }, ball: 10, scoreX: 100, scoreY: 200 };

const Caret = () => <span className="replay-caret" />;

/** `done` brings back the shell prompt; while the replay runs, a program owns the terminal. */
function TerminalScreen({ title, steps, ms, done }: { title: string; steps: readonly TerminalStep[]; ms: number; done: boolean }) {
  const { lines, typing } = terminalAt(steps, ms);
  return (
    <div className="replay-screen replay-terminal">
      <p className="replay-bar">{title}</p>
      <div className="replay-lines">
        {lines.map((line, i) => (
          <p key={i} className={`replay-line is-${line.kind} tone-${line.tone}`}>
            {PROMPT[line.kind]}
            {line.text}
            {typing && i === lines.length - 1 ? <Caret /> : null}
          </p>
        ))}
        {done ? (
          <p className="replay-line is-cmd">
            {PROMPT.cmd}
            <Caret />
          </p>
        ) : null}
      </div>
    </div>
  );
}

function WindowForm({ state, focus }: { state: WindowState; focus: WindowFocus }) {
  return (
    <>
      {(state.fields ?? []).map((field, i) => (
        <div key={i} className="replay-field">
          {field.label ? <span className="replay-label">{field.label}</span> : null}
          <span className={focus && "field" in focus && focus.field === i ? "replay-input is-focused" : "replay-input"}>
            {field.value || <span className="replay-placeholder">{field.placeholder}</span>}
            {focus && "field" in focus && focus.field === i ? <Caret /> : null}
          </span>
        </div>
      ))}
      {state.action ? <span className="replay-button">{state.action}</span> : null}
    </>
  );
}

function WindowScreen({ title, initial, steps, ms }: { title: string; initial: WindowState; steps: readonly WindowStep[]; ms: number }) {
  const { state, focus } = windowAt(initial, steps, ms);
  return (
    <div className="replay-screen replay-window">
      <p className="replay-bar">{title}</p>
      <div className="replay-app">
        {state.heading ? <p className="replay-heading">{state.heading}</p> : null}
        {state.status ? <p className="replay-status">{state.status}</p> : null}
        {state.display ? <p className="replay-display tabular">{state.display}</p> : null}
        <WindowForm state={state} focus={focus} />
        {state.marks ? <p className="replay-marks">{state.marks}</p> : null}
        <ul className="replay-items">
          {(state.items ?? []).map((item, i) => (
            <li key={i} className="replay-item">
              <span className="replay-item-text">
                {item.text}
                {focus && "item" in focus && focus.item === i ? <Caret /> : null}
                {item.meta ? <span className="replay-item-meta">{item.meta}</span> : null}
              </span>
              {item.actions?.map((action) => <span key={action} className="replay-chip">{action}</span>)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PongScreen({ title, ms }: { title: string; ms: number }) {
  const game = pongAt(ms);
  const { paddle } = COURT;
  return (
    <div className="replay-screen replay-pong">
      <p className="replay-bar">{title}</p>
      <svg viewBox={`${-COURT.width / 2} ${-COURT.height / 2} ${COURT.width} ${COURT.height}`} className="replay-court">
        <text x={-COURT.scoreX} y={-COURT.scoreY}>{game.score[0]}</text>
        <text x={COURT.scoreX} y={-COURT.scoreY}>{game.score[1]}</text>
        <rect x={-PONG.paddleX - paddle.width / 2} y={-game.left - paddle.height / 2} width={paddle.width} height={paddle.height} />
        <rect x={PONG.paddleX - paddle.width / 2} y={-game.right - paddle.height / 2} width={paddle.width} height={paddle.height} />
        <circle cx={game.x} cy={-game.y} r={COURT.ball} />
      </svg>
    </div>
  );
}

function Screen({ replay, ms }: { replay: Replay; ms: number }) {
  switch (replay.kind) {
    case "terminal":
      return <TerminalScreen title={replay.title} steps={replay.steps} ms={ms} done={ms >= replayDuration(replay)} />;
    case "window":
      return <WindowScreen title={replay.title} initial={replay.initial} steps={replay.steps} ms={ms} />;
    case "pong":
      return <PongScreen title={replay.title} ms={ms * replay.speed} />;
  }
}

/** Plays a replay from the top, or shows its last frame when it shouldn't animate on its own. */
function ReplayPlayer({ replay, autoplay }: { replay: Replay; autoplay: boolean }) {
  const { ms, status, toggle } = usePlayback(replayDuration(replay), autoplay);
  return (
    <figure className="replay">
      <div aria-hidden="true">
        <Screen replay={replay} ms={ms} />
      </div>
      <figcaption className="replay-caption">
        <span>
          {replay.description} <span className="replay-note">A replay of the repo&apos;s code, with sample values.</span>
        </span>
        <button type="button" className="replay-control" onClick={toggle}>
          {CONTROL_LABEL[status]}
        </button>
      </figcaption>
    </figure>
  );
}

/** Starts the replay afresh each time its pop-up opens, and parks it on the last frame while closed. */
export function ReplayFigure({ replay }: { replay: Replay }) {
  const open = useProjectOpen(replay.id);
  return <ReplayPlayer key={open ? "open" : "closed"} replay={replay} autoplay={open} />;
}
