/** The repo's sorts as steps, and what the bars show `ms` into a run of them. */

import type { SortAlgorithm, SortRun } from "@/domain/datasheet";
import { segmentAt } from "./timeline";

/** Positions are slots in the array, as the C++ indexes them. */
export type SortStep =
  | { readonly kind: "compare"; readonly a: number; readonly b: number; readonly caption: string }
  /** Selection sort's running minimum. */
  | { readonly kind: "mark"; readonly slot: number }
  | { readonly kind: "swap"; readonly a: number; readonly b: number }
  | { readonly kind: "settle"; readonly slot: number };

const COMPARE_MS = 320;
const SWAP_MS = 300;
/** The array is shown unsorted this long before the first compare. */
const RUN_INTRO_MS = 700;
/** The sorted array, with the program's output, stays up this long. */
const RUN_OUTRO_MS = 1600;

const swapped = (values: number[], a: number, b: number) => {
  [values[a], values[b]] = [values[b] ?? 0, values[a] ?? 0];
};

/** bubbleSort.cpp: each pass bubbles the largest left over to the end. */
function bubbleSteps(input: readonly number[]): SortStep[] {
  const values = [...input];
  const steps: SortStep[] = [];
  for (let i = values.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      const [x = 0, y = 0] = [values[j], values[j + 1]];
      steps.push({ kind: "compare", a: j, b: j + 1, caption: x > y ? `${x} > ${y}, swap` : `${x} < ${y}, keep` });
      if (x > y) {
        steps.push({ kind: "swap", a: j, b: j + 1 });
        swapped(values, j, j + 1);
      }
    }
    steps.push({ kind: "settle", slot: i });
  }
  return [...steps, { kind: "settle", slot: 0 }];
}

/** selectionSort.cpp: each pass finds the smallest left over and swaps it to the front. */
function selectionSteps(input: readonly number[]): SortStep[] {
  const values = [...input];
  const steps: SortStep[] = [];
  for (let i = 0; i < values.length; i++) {
    let min = i;
    steps.push({ kind: "mark", slot: i });
    for (let j = i + 1; j < values.length; j++) {
      const [x = 0, smallest = 0] = [values[j], values[min]];
      steps.push({ kind: "compare", a: min, b: j, caption: x < smallest ? `${x} < ${smallest}, new minimum` : `${x} > ${smallest}` });
      if (x < smallest) {
        min = j;
        steps.push({ kind: "mark", slot: j });
      }
    }
    if (min !== i) {
      steps.push({ kind: "swap", a: i, b: min });
      swapped(values, i, min);
    }
    steps.push({ kind: "settle", slot: i });
  }
  return steps;
}

const STEPS = { bubble: bubbleSteps, selection: selectionSteps } as const satisfies Record<
  SortAlgorithm,
  (input: readonly number[]) => SortStep[]
>;

export function sortSteps(run: SortRun): SortStep[] {
  return STEPS[run.algorithm](run.values);
}

const stepSpan = (step: SortStep) => (step.kind === "compare" ? COMPARE_MS : step.kind === "swap" ? SWAP_MS : 0);
const runSpan = (run: SortRun) => RUN_INTRO_MS + sortSteps(run).reduce((sum, step) => sum + stepSpan(step), 0) + RUN_OUTRO_MS;

export function sortDuration(runs: readonly SortRun[]): number {
  return runs.reduce((sum, run) => sum + runSpan(run), 0);
}

export interface SortFrame {
  readonly run: number;
  /** Where each bar sits, by its index in the run's starting array; fractional mid-swap. */
  readonly slots: readonly number[];
  readonly comparing: readonly number[];
  /** Selection sort's running minimum, as a bar index. */
  readonly marked: number | null;
  readonly settled: readonly number[];
  readonly caption: string;
  readonly done: boolean;
}

interface Board {
  /** order[slot] is the bar in that slot. */
  order: number[];
  comparing: number[];
  marked: number | null;
  settled: number[];
  caption: string;
  /** A swap in progress: its slots and how far along it is, 0 to 1. */
  moving: { a: number; b: number; t: number } | null;
}

function apply(board: Board, step: SortStep, elapsed: number): Board {
  const bar = (slot: number) => board.order[slot] ?? 0;
  switch (step.kind) {
    case "compare":
      return { ...board, comparing: [bar(step.a), bar(step.b)], caption: step.caption, moving: null };
    case "mark":
      return { ...board, marked: bar(step.slot) };
    case "settle":
      return { ...board, comparing: [], settled: [...board.settled, bar(step.slot)], moving: null };
    case "swap": {
      if (elapsed < SWAP_MS) {
        return { ...board, moving: { a: step.a, b: step.b, t: elapsed / SWAP_MS } };
      }
      const order = [...board.order];
      [order[step.a], order[step.b]] = [bar(step.b), bar(step.a)];
      return { ...board, order, moving: null };
    }
  }
}

function slotsOf({ order, moving }: Board): number[] {
  const slots: number[] = [];
  order.forEach((bar, slot) => (slots[bar] = slot));
  if (moving) {
    const [a, b] = [order[moving.a] ?? 0, order[moving.b] ?? 0];
    const shift = (moving.b - moving.a) * moving.t;
    slots[a] = moving.a + shift;
    slots[b] = moving.b - shift;
  }
  return slots;
}

function runFrame(index: number, run: SortRun, elapsed: number): SortFrame {
  const start: Board = { order: run.values.map((_, i) => i), comparing: [], marked: null, settled: [], caption: "", moving: null };
  let board = start;
  let at = RUN_INTRO_MS;
  for (const step of sortSteps(run)) {
    if (elapsed < at) {
      break;
    }
    board = apply(board, step, elapsed - at);
    at += stepSpan(step);
  }
  const done = elapsed >= at;
  const output = done ? board.order.map((bar) => run.values[bar]).join(" ") : board.caption;
  return {
    run: index,
    slots: slotsOf(board),
    comparing: done ? [] : board.comparing,
    marked: done ? null : board.marked,
    settled: board.settled,
    caption: output,
    done,
  };
}

export function sortAt(runs: readonly SortRun[], ms: number): SortFrame {
  const segment = segmentAt(runs.map(runSpan), ms);
  const run = segment ? runs[segment.index] : undefined;
  if (!segment || !run) {
    return { run: 0, slots: [], comparing: [], marked: null, settled: [], caption: "", done: false };
  }
  return runFrame(segment.index, run, segment.elapsed);
}
