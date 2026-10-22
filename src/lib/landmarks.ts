import type { GestureSet } from "@/domain/datasheet";

/** MediaPipe hand topology, as drawn by gesture_utils.draw_hand_landmarks. */
export const HAND_CONNECTIONS: readonly (readonly [number, number])[] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

export interface Domain {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export type Point = readonly [number, number];

/** Bounding box over every landmark of every set, padded so small multiples share one scale. */
export function sharedDomain(sets: readonly GestureSet[], padding: number): Domain {
  const points = sets.flatMap((set) => set.samples.flat());
  if (points.length === 0) {
    throw new Error("Cannot compute a domain from zero landmarks");
  }
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    xMin: Math.min(...xs) - padding,
    xMax: Math.max(...xs) + padding,
    yMin: Math.min(...ys) - padding,
    yMax: Math.max(...ys) + padding,
  };
}

/** Mean position of each landmark across samples. */
export function meanPose(samples: GestureSet["samples"]): Point[] {
  const first = samples[0];
  if (!first) {
    throw new Error("Cannot average zero samples");
  }
  return first.map((_, landmark) => {
    const coords = samples.map((sample) => sample[landmark] ?? [0, 0]);
    const sum = coords.reduce<[number, number]>((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
    return [sum[0] / coords.length, sum[1] / coords.length] as const;
  });
}

/** Each gesture's mean pose, with one domain that fits every recorded sample. */
export interface HandPoses {
  readonly domain: Domain;
  readonly poses: Readonly<Record<string, readonly Point[]>>;
}

export function handPoses(sets: readonly GestureSet[], padding: number): HandPoses {
  return {
    domain: sharedDomain(sets, padding),
    poses: Object.fromEntries(sets.map((set) => [set.gesture, meanPose(set.samples)])),
  };
}

/** The pose `t` of the way from `from` to `to`, landmark by landmark. */
export function lerpPose(from: readonly Point[], to: readonly Point[], t: number): Point[] {
  return to.map(([x, y], i) => {
    const [fx, fy] = from[i] ?? [x, y];
    return [fx + (x - fx) * t, fy + (y - fy) * t] as const;
  });
}

/** Maps a data-space point into a width x height viewport (y already grows downward). */
export function project(point: Point, domain: Domain, width: number, height: number): Point {
  const [x, y] = point;
  return [
    ((x - domain.xMin) / (domain.xMax - domain.xMin)) * width,
    ((y - domain.yMin) / (domain.yMax - domain.yMin)) * height,
  ];
}

const isPoint = (value: unknown): value is Point =>
  Array.isArray(value) && value.length === 2 && value.every((n) => typeof n === "number" && Number.isFinite(n));

/** Validates the extracted sample file at the boundary instead of trusting the JSON's widened types. */
export function parseGestureFile(data: unknown): GestureSet[] {
  const gestures = (data as { gestures?: unknown } | null)?.gestures;
  if (!Array.isArray(gestures)) {
    throw new Error("Gesture file is missing a gestures array");
  }
  return gestures.map((entry: unknown, i) => {
    const { gesture, recorded, samples } = (entry ?? {}) as Record<string, unknown>;
    const valid =
      typeof gesture === "string" &&
      typeof recorded === "number" &&
      Array.isArray(samples) &&
      samples.every((sample) => Array.isArray(sample) && sample.every(isPoint));
    if (!valid) {
      throw new Error(`Gesture entry ${i} is malformed`);
    }
    return { gesture, recorded, samples: samples as GestureSet["samples"] };
  });
}
