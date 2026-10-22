/** Shared timing for the demos, whose scenes play back to back. */

export interface Segment {
  readonly index: number;
  /** Time spent in the segment, capped at its span. */
  readonly elapsed: number;
}

/** Which of back-to-back segments `ms` falls in; past the end, the last one, finished. Null when there are none. */
export function segmentAt(spans: readonly number[], ms: number): Segment | null {
  let start = 0;
  for (const [index, span] of spans.entries()) {
    if (ms < start + span || index === spans.length - 1) {
      return { index, elapsed: Math.min(ms - start, span) };
    }
    start += span;
  }
  return null;
}
