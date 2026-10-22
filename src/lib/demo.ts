/** Pure timelines for the featured projects' live diagrams: what each one shows `ms` into its demo. */

import type { Demo, DemoRequest, GestureBeat, GestureMode, OperatorBeat } from "@/domain/datasheet";
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
/** Each line of main is on screen this long; its printed value appears after RESULT_DELAY_MS. */
const OPERATOR_MS = 750;
const RESULT_DELAY_MS = 300;
/** The heap Ints are shown allocated this long before the first delete. */
const HEAP_INTRO_MS = 700;
/** Time from one recursive call's delete to the next. */
const DELETE_MS = 700;
const HEAP_HOLD_MS = 1600;

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

/** What main is running: one of its operator lines, or the nth recursive ptr_deleter call. */
export type OperatorStep = { readonly kind: "operator"; readonly index: number } | { readonly kind: "delete"; readonly call: number };

export interface OperatorFrame {
  readonly step: OperatorStep;
  readonly showResult: boolean;
  /** `a` as of this moment. */
  readonly a: number;
  /** True once the line on screen has changed `a`. */
  readonly changed: boolean;
  readonly allocated: boolean;
  /** How many heap Ints have been deleted. */
  readonly freed: number;
  readonly pulse: number | null;
}

/** `a` after the first `count` lines. */
function aAfter(beats: readonly OperatorBeat[], count: number, initial: number): number {
  return beats.slice(0, count).reduce((a, beat) => beat.a ?? a, initial);
}

const heapPath = (count: number) => Array.from({ length: count }, (_, i) => i);
const heapSpan = (count: number) => HEAP_INTRO_MS + travelMs(heapPath(count), DELETE_MS) + HEAP_HOLD_MS;

function heapFrame(count: number, a: number, elapsed: number): OperatorFrame {
  const base = { showResult: false, a, changed: false, allocated: true };
  const travel = elapsed - HEAP_INTRO_MS;
  if (travel < 0) {
    return { ...base, step: { kind: "delete", call: 0 }, freed: 0, pulse: null };
  }
  const path = heapPath(count);
  const pulse = pulseAt(path, travel, DELETE_MS);
  const moving = travel < travelMs(path, DELETE_MS);
  return { ...base, step: { kind: "delete", call: pulse.reached - 1 }, freed: pulse.reached, pulse: moving ? pulse.at : null };
}

/** main.cpp line by line: each operator with its printed value, then ptr_deleter freeing the heap Ints. */
export function operatorsAt(initial: number, beats: readonly OperatorBeat[], heap: number, ms: number): OperatorFrame {
  const index = Math.floor(ms / OPERATOR_MS);
  if (index >= beats.length) {
    return heapFrame(heap, aAfter(beats, beats.length, initial), Math.min(ms - beats.length * OPERATOR_MS, heapSpan(heap)));
  }
  const showResult = ms - index * OPERATOR_MS >= RESULT_DELAY_MS;
  const changed = showResult && beats[index]?.a !== undefined;
  return {
    step: { kind: "operator", index },
    showResult,
    a: aAfter(beats, showResult ? index + 1 : index, initial),
    changed,
    allocated: false,
    freed: 0,
    pulse: null,
  };
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
    case "operators":
      return demo.beats.length * OPERATOR_MS + heapSpan(demo.heap.values.length);
  }
}
