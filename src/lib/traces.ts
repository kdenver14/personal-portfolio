/**
 * Circuit-board traces for the corner decoration. A trace is routed PCB style: every segment runs
 * horizontally, vertically or at 45°, and the trace ends on a round pad.
 */
export type Point = readonly [number, number];

export interface Trace {
  d: string;
  /** Where the pad sits: the trace's last point. */
  end: Point;
}

function isOctilinear(from: Point, to: Point): boolean {
  const dx = Math.abs(to[0] - from[0]);
  const dy = Math.abs(to[1] - from[1]);
  return (dx > 0 || dy > 0) && (dx === 0 || dy === 0 || dx === dy);
}

export function routeTrace(points: readonly Point[]): Trace {
  const [first, ...rest] = points;
  if (!first || rest.length === 0) {
    throw new RangeError("A trace needs at least two points");
  }
  let end = first;
  for (const next of rest) {
    if (!isOctilinear(end, next)) {
      throw new RangeError(`Trace segment ${end.join(",")} to ${next.join(",")} is not horizontal, vertical or 45°`);
    }
    end = next;
  }
  return { d: `M${points.map(([x, y]) => `${x} ${y}`).join("L")}`, end };
}
