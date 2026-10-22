/** Pure timelines for the featured projects' live diagrams: what each one shows `ms` into its demo. */

import type { Demo, DemoRequest, GestureBeat, GestureMode } from "@/domain/datasheet";
import { sortDuration } from "./sort";

/** Time for the pulse to travel from one stop to the next; skipping stops takes proportionally longer. */
export const HOP_MS = 380;
/** The request is shown this long before the pulse sets off. */
const REQUEST_INTRO_MS = 600;
/** The response stays up this long before the next request. */
const ANSWER_MS = 1900;
/** The hand eases from one pose to the next over this long. */
const MORPH_MS = 700;
const GESTURE_HOP_MS = 300;
const GESTURE_HOLD_MS = 1300;
const FIRST_ERROR_STATUS = 400;

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export interface Pulse {
  /** Stop position; fractional while travelling between stops. */
  readonly at: number;
  /** How many entries of the path it has arrived at. */
  readonly reached: number;
}

const hopLength = (from: number, to: number, hopMs: number) => Math.abs(to - from) * hopMs;

/** Total travel time along `path`. */
export function travelMs(path: readonly number[], hopMs: number = HOP_MS): number {
  return path.slice(1).reduce((sum, stop, i) => sum + hopLength(path[i] ?? stop, stop, hopMs), 0);
}

/** Where a pulse travelling `path` is after `elapsed` ms, easing in and out of each hop. */
export function pulseAt(path: readonly number[], elapsed: number, hopMs: number = HOP_MS): Pulse {
  let start = 0;
  for (let i = 1; i < path.length; i++) {
    const from = path[i - 1] ?? 0;
    const to = path[i] ?? from;
    const length = hopLength(from, to, hopMs);
    if (elapsed < start + length) {
      return { at: from + (to - from) * smoothstep((elapsed - start) / length), reached: i };
    }
    start += length;
  }
  return { at: path.at(-1) ?? 0, reached: path.length };
}

/** Out through `visits`, then back the way it came to the stop that answers. */
export function requestPath(request: DemoRequest): number[] {
  const turn = request.visits.lastIndexOf(request.answeredAt);
  const back = request.visits.slice(turn, -1).reverse();
  return [...request.visits, ...back];
}

/** The stop that turned the request away, when it got no further than the stop that refused it. */
export function refusedAt(request: DemoRequest): number | null {
  return request.status >= FIRST_ERROR_STATUS && request.visits.at(-1) === request.answeredAt ? request.answeredAt : null;
}

const requestSpan = (request: DemoRequest) => REQUEST_INTRO_MS + travelMs(requestPath(request)) + ANSWER_MS;

export interface RequestFrame {
  readonly index: number;
  /** Null before the pulse sets off and once the response is back. */
  readonly pulse: number | null;
  /** Stops the request has reached so far. */
  readonly lit: readonly number[];
  readonly answered: boolean;
}

function requestFrame(index: number, request: DemoRequest, elapsed: number): RequestFrame {
  const path = requestPath(request);
  const travel = elapsed - REQUEST_INTRO_MS;
  if (travel < 0) {
    return { index, pulse: null, lit: [], answered: false };
  }
  const pulse = pulseAt(path, travel);
  const lit = [...new Set(path.slice(0, pulse.reached))];
  const answered = travel >= travelMs(path);
  return { index, pulse: answered ? null : pulse.at, lit, answered };
}

export function requestsAt(requests: readonly DemoRequest[], ms: number): RequestFrame {
  let start = 0;
  for (const [index, request] of requests.entries()) {
    const span = requestSpan(request);
    if (ms < start + span || index === requests.length - 1) {
      return requestFrame(index, request, Math.min(ms - start, span));
    }
    start += span;
  }
  return { index: 0, pulse: null, lit: [], answered: false };
}

const gestureSpan = (stops: number) => MORPH_MS + (stops - 1) * GESTURE_HOP_MS + GESTURE_HOLD_MS;

export interface GestureFrame {
  readonly index: number;
  /** The previous beat's pose eases into this one: 0 is the previous pose, 1 this beat's. */
  readonly blend: number;
  readonly pulse: number | null;
  /** How many stops the reading has reached this beat. */
  readonly reached: number;
}

export function gestureAt(beats: readonly GestureBeat[], stops: number, ms: number): GestureFrame {
  const span = gestureSpan(stops);
  const index = Math.min(beats.length - 1, Math.max(0, Math.floor(ms / span)));
  const elapsed = Math.min(span, ms - index * span);
  const blend = smoothstep(clamp01(elapsed / MORPH_MS));
  const travel = elapsed - MORPH_MS;
  if (travel < 0) {
    return { index, blend, pulse: null, reached: 0 };
  }
  const path = Array.from({ length: stops }, (_, i) => i);
  const pulse = pulseAt(path, travel, GESTURE_HOP_MS);
  return { index, blend, pulse: pulse.reached < stops ? pulse.at : null, reached: pulse.reached };
}

/** The mode before `index`'s beat: the mode the app starts in, or the one the previous beat left. */
export function modeBefore(beats: readonly GestureBeat[], index: number, initial: GestureMode): GestureMode {
  return beats[index - 1]?.mode ?? initial;
}

/** How long a demo runs, in ms; at or past this it shows its final frame. */
export function demoDuration(demo: Demo): number {
  switch (demo.kind) {
    case "requests":
      return demo.requests.reduce((sum, request) => sum + requestSpan(request), 0);
    case "sort":
      return sortDuration(demo.runs);
    case "gesture":
      return demo.beats.length * gestureSpan(demo.stops.length);
  }
}
