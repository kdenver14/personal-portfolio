/** Grey dots scattered around the text column, and how each one floats up while the cursor is near. */

export type Point = readonly [number, number];
export type Offset = readonly [number, number];

export interface Dot {
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly alpha: number;
  /** Where in its bob the dot starts, in radians, so neighbours never move in step. */
  readonly phase: number;
  /** Bob speed multiplier, so neighbours drift out of sync over time. */
  readonly pace: number;
}

export interface Particle {
  readonly dot: Dot;
  readonly offset: Offset;
}

export interface Field {
  readonly width: number;
  readonly height: number;
  /** Width of the text column, centred in the field. */
  readonly column: number;
}

export const HOME: Offset = [0, 0];
/** Dots never come closer than this to the text column. */
export const COLUMN_GAP = 32;
/** Past the gap, dots thin out over this distance, so the field fades in toward the edges. */
const COLUMN_FADE = 160;
const SPACING = 26;
const POISSON_TRIES = 30;
const FULL_TURN = Math.PI * 2;
const RADIUS = { min: 0.9, spread: 1.1 };
const ALPHA = { min: 0.16, spread: 0.16 };
const PACE = { min: 0.6, spread: 0.8 };

/** Cursor distance within which dots float. */
const REACH = 130;
const LIFT = 9;
const SWAY = 3;
const BOB = 3;
const SWAY_RATE = 1.3;
const BOB_RATE = 2;
/** Seconds for a dot to cover about 63% of the way to its target; time-based, so frame rate doesn't matter. */
const SETTLE_SECONDS = 0.12;
/** Offsets smaller than this (px) count as home. */
const REST = 0.05;
const SHADOW_PER_PX = 0.01;
const SHADOW_MAX = 0.08;

const UINT32_RANGE = 2 ** 32;

/** Mulberry32, a small seeded PRNG: the same seed gives the same scatter on every load. */
export function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / UINT32_RANGE;
  };
}

interface Grid {
  readonly cell: number;
  readonly cols: number;
  readonly rows: number;
  readonly slots: (Point | undefined)[];
}

/** A lookup grid whose cells are small enough to hold at most one point. */
function createGrid(width: number, height: number, spacing: number): Grid {
  const cell = spacing / Math.SQRT2;
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  return { cell, cols, rows, slots: new Array<Point | undefined>(cols * rows) };
}

function isClear(grid: Grid, [x, y]: Point, spacing: number): boolean {
  const col = Math.floor(x / grid.cell);
  const row = Math.floor(y / grid.cell);
  for (let r = Math.max(0, row - 2); r <= Math.min(grid.rows - 1, row + 2); r++) {
    for (let c = Math.max(0, col - 2); c <= Math.min(grid.cols - 1, col + 2); c++) {
      const other = grid.slots[r * grid.cols + c];
      if (other && Math.hypot(other[0] - x, other[1] - y) < spacing) {
        return false;
      }
    }
  }
  return true;
}

/** A random point in the ring between one and two spacings around `origin`. */
function around([x, y]: Point, spacing: number, random: () => number): Point {
  const angle = random() * FULL_TURN;
  const distance = spacing * (1 + random());
  return [x + Math.cos(angle) * distance, y + Math.sin(angle) * distance];
}

/** Bridson's Poisson-disc sampling: points at least `spacing` apart, irregular but free of clumps and holes. */
export function poissonDisc(width: number, height: number, spacing: number, random: () => number): Point[] {
  const grid = createGrid(width, height, spacing);
  const points: Point[] = [];
  const active: Point[] = [];
  const add = (point: Point) => {
    grid.slots[Math.floor(point[1] / grid.cell) * grid.cols + Math.floor(point[0] / grid.cell)] = point;
    points.push(point);
    active.push(point);
  };
  const inside = ([x, y]: Point) => x >= 0 && y >= 0 && x < width && y < height;
  add([random() * width, random() * height]);
  while (active.length > 0) {
    const index = Math.floor(random() * active.length);
    const origin = active[index] ?? HOME;
    let next: Point | undefined;
    for (let tries = 0; tries < POISSON_TRIES && !next; tries++) {
      const candidate = around(origin, spacing, random);
      next = inside(candidate) && isClear(grid, candidate, spacing) ? candidate : undefined;
    }
    if (next) {
      add(next);
    } else {
      active.splice(index, 1);
    }
  }
  return points;
}

/** Dots in the margins beside the column: none within the gap, thinning toward it, densest at the screen edges. */
export function scatterDots({ width, height, column }: Field, seed: number): Dot[] {
  const random = seededRandom(seed);
  const edge = column / 2 + COLUMN_GAP;
  return poissonDisc(width, height, SPACING, random).flatMap(([x, y]) => {
    const beyond = Math.abs(x - width / 2) - edge;
    const keep = Math.min(1, beyond / COLUMN_FADE);
    if (beyond <= 0 || random() > keep * keep) {
      return [];
    }
    return [{
      x,
      y,
      radius: RADIUS.min + random() * RADIUS.spread,
      alpha: ALPHA.min + random() * ALPHA.spread,
      phase: random() * FULL_TURN,
      pace: PACE.min + random() * PACE.spread,
    }];
  });
}

/** Where a dot floats to at `seconds`: up and bobbing near the pointer, home beyond REACH or with no pointer. */
export function floatOffset(dot: Dot, pointer: Point | null, seconds: number): Offset {
  if (!pointer) {
    return HOME;
  }
  const distance = Math.hypot(dot.x - pointer[0], dot.y - pointer[1]);
  if (distance >= REACH) {
    return HOME;
  }
  const near = 1 - distance / REACH;
  const lift = near * near * (3 - 2 * near);
  return [
    Math.cos(seconds * SWAY_RATE * dot.pace + dot.phase) * SWAY * lift,
    -LIFT * lift + Math.sin(seconds * BOB_RATE * dot.pace + dot.phase) * BOB * lift,
  ];
}

const isHome = ([x, y]: Offset) => Math.abs(x) < REST && Math.abs(y) < REST;

/** Eases every particle toward its float target over `dt` seconds; `moving` is false once all are home. */
export function step(
  particles: readonly Particle[],
  pointer: Point | null,
  seconds: number,
  dt: number,
): { particles: Particle[]; moving: boolean } {
  const blend = 1 - Math.exp(-dt / SETTLE_SECONDS);
  let moving = false;
  const next = particles.map(({ dot, offset }) => {
    const target = floatOffset(dot, pointer, seconds);
    const eased: Offset = [offset[0] + (target[0] - offset[0]) * blend, offset[1] + (target[1] - offset[1]) * blend];
    moving ||= !isHome(target) || !isHome(eased);
    return { dot, offset: eased };
  });
  return { particles: next, moving };
}

/** Opacity of the faint shadow left under a dot lifted by `offsetY` (negative is up); zero when not lifted. */
export function shadowAlpha(offsetY: number): number {
  return offsetY < 0 ? Math.min(SHADOW_MAX, -offsetY * SHADOW_PER_PX) : 0;
}
