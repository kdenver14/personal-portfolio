/** Pure timelines for the More projects replays: what each screen shows `ms` into its replay. */

import type { Replay, TerminalStep, TerminalTone, WindowState, WindowStep } from "@/domain/datasheet";

/** Milliseconds per typed character. */
export const TYPE_MS = 45;
/** Pause after a command is typed, before its output. */
const ENTER_MS = 400;
/** Pause after typing into a field. */
const FIELD_MS = 350;
/** Gap after each printed line or note. */
const LINE_MS = 300;
/** Hold after each window change. */
const SET_MS = 900;
const MS_PER_SECOND = 1000;

export interface TerminalLine {
  readonly kind: "cmd" | "out" | "note";
  readonly text: string;
  readonly tone: TerminalTone;
}

export interface TerminalFrame {
  readonly lines: readonly TerminalLine[];
  /** True while a command is still being typed. */
  readonly typing: boolean;
}

/** Where the caret is: a form field or a list item, by index. */
export type WindowFocus = { readonly field: number } | { readonly item: number } | null;

export interface WindowFrame {
  readonly state: WindowState;
  readonly focus: WindowFocus;
}

/** Runs `steps` from `initial` up to `ms`. Each step owns a span of time; `apply` gets the time spent in it. */
function play<S, Step>(
  initial: S,
  steps: readonly Step[],
  ms: number,
  span: (step: Step) => number,
  apply: (state: S, step: Step, elapsed: number) => S,
): S {
  let state = initial;
  let start = 0;
  for (const step of steps) {
    if (ms < start) {
      break;
    }
    const length = span(step);
    state = apply(state, step, Math.min(ms - start, length));
    start += length;
  }
  return state;
}

const typed = (text: string, elapsed: number) => text.slice(0, Math.floor(elapsed / TYPE_MS));

function terminalSpan(step: TerminalStep): number {
  if ("cmd" in step) {
    return step.cmd.length * TYPE_MS + ENTER_MS;
  }
  return "wait" in step ? step.wait : LINE_MS;
}

function applyTerminal({ lines }: TerminalFrame, step: TerminalStep, elapsed: number): TerminalFrame {
  if ("cmd" in step) {
    const text = typed(step.cmd, elapsed);
    return { lines: [...lines, { kind: "cmd", text, tone: "plain" }], typing: text.length < step.cmd.length };
  }
  if ("wait" in step) {
    return { lines, typing: false };
  }
  const line: TerminalLine =
    "out" in step ? { kind: "out", text: step.out, tone: step.tone ?? "plain" } : { kind: "note", text: step.note, tone: "plain" };
  return { lines: [...lines, line], typing: false };
}

export function terminalAt(steps: readonly TerminalStep[], ms: number): TerminalFrame {
  return play<TerminalFrame, TerminalStep>({ lines: [], typing: false }, steps, ms, terminalSpan, applyTerminal);
}

function windowSpan(step: WindowStep): number {
  if ("type" in step) {
    return step.type.length * TYPE_MS + FIELD_MS;
  }
  if ("append" in step) {
    return step.append.length * TYPE_MS + FIELD_MS;
  }
  if ("set" in step) {
    return step.hold ?? SET_MS;
  }
  return step.wait;
}

const replaceAt = <T>(list: readonly T[], index: number, update: (value: T) => T): T[] =>
  list.map((value, i) => (i === index ? update(value) : value));

function applyWindow({ state }: WindowFrame, step: WindowStep, elapsed: number): WindowFrame {
  if ("set" in step) {
    return { state: { ...state, ...step.set }, focus: null };
  }
  if ("wait" in step) {
    return { state, focus: null };
  }
  const fields = state.fields ?? [];
  if ("type" in step) {
    const field = step.field ?? fields.length - 1;
    const value = typed(step.type, elapsed);
    return { state: { ...state, fields: replaceAt(fields, field, (f) => ({ ...f, value })) }, focus: { field } };
  }
  const more = typed(step.append, elapsed);
  if ("item" in step) {
    const items = replaceAt(state.items ?? [], step.item, (it) => ({ ...it, text: it.text + more }));
    return { state: { ...state, items }, focus: { item: step.item } };
  }
  const updated = replaceAt(fields, step.field, (f) => ({ ...f, value: f.value + more }));
  return { state: { ...state, fields: updated }, focus: { field: step.field } };
}

export function windowAt(initial: WindowState, steps: readonly WindowStep[], ms: number): WindowFrame {
  return play<WindowFrame, WindowStep>({ state: initial, focus: null }, steps, ms, windowSpan, applyWindow);
}

/** How long a replay runs, in ms; at or past this it shows its final frame. */
export function replayDuration(replay: Replay): number {
  switch (replay.kind) {
    case "terminal":
      return replay.steps.reduce((sum, step) => sum + terminalSpan(step), 0);
    case "window":
      return replay.steps.reduce((sum, step) => sum + windowSpan(step), 0);
    case "pong":
      return replay.seconds * MS_PER_SECOND;
  }
}

/** pong-game's own numbers: an 800×600 court centred on 0, y up, in turtle units. */
export const PONG = {
  wall: 280,
  paddleX: 350,
  /** A paddle returns the ball when their centres are this close and the ball is past `hitX`. */
  hitDistance: 50,
  hitX: 320,
  /** Past this the ball is out and the other side scores. */
  outX: 380,
  ballStep: 10,
  /** Seconds per tick; each paddle hit multiplies it by `speedUp`, so rallies get faster. */
  startTick: 0.1,
  speedUp: 0.9,
  /** The replay steers both paddles toward the ball; the left one is slower, so it sometimes misses. */
  reach: { left: 6, right: 20 },
} as const;

export interface PongState {
  readonly x: number;
  readonly y: number;
  readonly dx: number;
  readonly dy: number;
  readonly left: number;
  readonly right: number;
  readonly score: readonly [number, number];
  readonly tick: number;
}

export const PONG_START: PongState = {
  x: 0, y: 0, dx: PONG.ballStep, dy: PONG.ballStep, left: 0, right: 0, score: [0, 0], tick: PONG.startTick,
};

const follow = (paddle: number, target: number, reach: number) =>
  paddle + Math.max(-reach, Math.min(reach, target - paddle));

/** One tick of pong-game's main loop, with the paddles steered toward the ball. */
export function pongStep(state: PongState): PongState {
  const left = state.dx < 0 ? follow(state.left, state.y, PONG.reach.left) : state.left;
  const right = state.dx > 0 ? follow(state.right, state.y, PONG.reach.right) : state.right;
  const x = state.x + state.dx;
  const y = state.y + state.dy;
  const dy = Math.abs(y) > PONG.wall ? -state.dy : state.dy;
  const hitRight = Math.hypot(x - PONG.paddleX, y - right) < PONG.hitDistance && x > PONG.hitX;
  const hitLeft = Math.hypot(x + PONG.paddleX, y - left) < PONG.hitDistance && x < -PONG.hitX;
  const next = { ...state, x, y, dy, left, right };
  if (hitRight || hitLeft) {
    return { ...next, dx: -state.dx, tick: state.tick * PONG.speedUp };
  }
  if (Math.abs(x) > PONG.outX) {
    const score: readonly [number, number] = x > 0 ? [state.score[0] + 1, state.score[1]] : [state.score[0], state.score[1] + 1];
    return { ...next, x: 0, y: 0, dx: -state.dx, score, tick: PONG.startTick * PONG.speedUp };
  }
  return next;
}

/** The game `ms` in: every whole tick that fits, from the opening serve. */
export function pongAt(ms: number): PongState {
  let state = PONG_START;
  let clock = 0;
  while (clock + state.tick * MS_PER_SECOND <= ms) {
    clock += state.tick * MS_PER_SECOND;
    state = pongStep(state);
  }
  return state;
}
