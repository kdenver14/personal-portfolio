/**
 * A liquid field of grey dashes around the text column. A ring trails the cursor and swells the dashes it
 * passes over, and smooth noise keeps every particle drifting. Pure: the component draws what this computes.
 */

import type { Noise3 } from "./noise";

export type Point = readonly [number, number];

export interface Field {
  readonly width: number;
  readonly height: number;
  /** Width of the text column, centred in the field. */
  readonly column: number;
}

export interface Particle {
  readonly x: number;
  readonly y: number;
  /** 0 beside the text column, rising to 1 well clear of it. */
  readonly visibility: number;
}

export interface Ring {
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  /** Width of the swollen band around the radius. */
  readonly band: number;
  /** How far noise bends the band's edge in or out. */
  readonly wobble: number;
}

/** One particle as drawn this frame: a dash pointing away from the ring centre, or a speck when small. */
export interface Mark {
  readonly x: number;
  readonly y: number;
  readonly angle: number;
  /** 0 is a speck, 1 a full dash on the ring. */
  readonly size: number;
  readonly visibility: number;
}

/** Marks sharing one width and opacity, as flat x1, y1, x2, y2 runs, so each is drawn with one stroke. */
export interface Stroke {
  readonly width: number;
  readonly alpha: number;
  readonly segments: readonly number[];
}

/** Within this distance of the text column, and under it, particles stay dimmed. */
export const COLUMN_GAP = 16;
/** Past the gap, particles brighten to full over this distance. */
const COLUMN_FADE = 110;
/** Visibility of particles under the text: present, so the field reads as one, but quiet behind the words. */
export const COLUMN_DIM = 0.14;
const SPACING = 26;
const POISSON_TRIES = 20;
const FULL_TURN = Math.PI * 2;
const UINT32_RANGE = 2 ** 32;

/** The ring's radius is a share of the larger screen side, so it reaches the margins from the column. */
const RING = { share: 0.3, band: 0.22, breath: 0.09, breathRate: 1.1 };
/** With no mouse, the ring wanders around a point a little below the screen centre. */
const IDLE = { x: 0.5, y: 0.55, swayX: 0.22, swayY: 0.16, rateX: 0.42, rateY: 0.33 };
/** With a mouse, the ring circles a little around it, so the field keeps moving while the mouse rests. */
const ORBIT = { share: 0.06, rate: 0.8 };
/** Noise layers: `scale` per px, `speed` per second, `offset` decorrelates layers sampled at one spot. */
const FLOW = { scale: 0.004, speed: 0.38, amount: 15, offset: 31.7 };
const RIPPLE = { scale: 0.03, speed: 0.9, amount: 2.5, offset: 5.1 };
const EDGE = { scale: 0.008, speed: 0.6, amount: 0.12, offset: 9 };
const GRAIN = { scale: 0.012, speed: 0.35, inside: 0.12, outside: 0.048, offset: 4 };
const TILT = { scale: 0.02, speed: 0.9, amount: 0.35, offset: 17 };
const INSIDE_SIZE = 0.32;
const BAND_SHARPNESS = 2.2;
/** Particles on the band are pushed this far (px) away from the ring centre. */
const BAND_PUSH = 10;
/** Seconds for a particle's size to cover about 63% of the way to its target. */
const SIZE_SECONDS = 0.22;

const SIZE_LEVELS = 6;
const FADE_LEVELS = 8;
const SPECK = { width: 1.1, alpha: 0.28, halfLength: 0.01 };
const DASH = { width: 1.2, widthStep: 0.28, alpha: 0.3, alphaStep: 0.08, halfLength: 1, stretch: 4 };

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
    const origin = active[index] ?? [0, 0];
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

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Particles over the whole field: dimmed under and beside the text column, brightening beyond it. */
export function scatterParticles({ width, height, column }: Field, seed: number): Particle[] {
  const edge = column / 2 + COLUMN_GAP;
  return poissonDisc(width, height, SPACING, seededRandom(seed)).map(([x, y]) => {
    const beyond = Math.abs(x - width / 2) - edge;
    const clear = beyond > 0 ? smoothstep(Math.min(1, beyond / COLUMN_FADE)) : 0;
    return { x, y, visibility: COLUMN_DIM + (1 - COLUMN_DIM) * clear };
  });
}

/** Share of the way to a target covered in `dt` seconds; time-based, so the frame rate doesn't matter. */
export function easing(dt: number, seconds: number): number {
  return 1 - Math.exp(-dt / seconds);
}

export function easeToward(from: Point, to: Point, dt: number, seconds: number): Point {
  const t = easing(dt, seconds);
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
}

/** Where the ring heads with no mouse: a slow wander around a point a little below the centre. */
export function idleCentre({ width, height }: Field, seconds: number): Point {
  return [
    width * (IDLE.x + IDLE.swayX * Math.sin(seconds * IDLE.rateX)),
    height * (IDLE.y + IDLE.swayY * Math.cos(seconds * IDLE.rateY)),
  ];
}

/** Where the ring heads with a mouse: a small circle around the pointer. */
export function pointerCentre([x, y]: Point, { width, height }: Field, seconds: number): Point {
  const radius = ORBIT.share * RING.share * Math.max(width, height);
  return [x + radius * Math.cos(seconds * ORBIT.rate), y + radius * Math.sin(seconds * ORBIT.rate)];
}

/** The ring around `centre`; its radius breathes. */
export function ringAt([x, y]: Point, { width, height }: Field, seconds: number): Ring {
  const base = RING.share * Math.max(width, height);
  const radius = base * (1 + RING.breath * Math.sin(seconds * RING.breathRate));
  return { x, y, radius, band: RING.band * base, wobble: EDGE.amount * base };
}

/** 1 on the ring's radius, falling off smoothly either side. */
function bandStrength(distance: number, ring: Ring): number {
  return Math.exp(-BAND_SHARPNESS * ((distance - ring.radius) / ring.band) ** 2);
}

/** How big a particle wants to be: full on the ring, medium inside it, a speck outside. `grain` is noise. */
export function sizeTarget(distance: number, ring: Ring, grain: number): number {
  const rest = distance < ring.radius ? INSIDE_SIZE + GRAIN.inside * (grain + 1) : GRAIN.outside * (grain + 1);
  return Math.max(bandStrength(distance, ring), rest);
}

type Sampler = (layer: { scale: number; speed: number; offset: number }, shift?: number) => number;

/** Noise for one particle at one moment, by layer; `shift` gives a second, independent channel. */
function sampler(particle: Particle, seconds: number, noise: Noise3): Sampler {
  return ({ scale, speed, offset }, shift = 0) =>
    noise(particle.x * scale + offset + shift, particle.y * scale + offset, seconds * speed + offset);
}

/** The particle's home moved by slow flow plus a finer ripple. */
function drift(particle: Particle, sample: Sampler): Point {
  return [
    particle.x + sample(FLOW) * FLOW.amount + sample(RIPPLE) * RIPPLE.amount,
    particle.y + sample(FLOW, FLOW.offset) * FLOW.amount + sample(RIPPLE, RIPPLE.offset) * RIPPLE.amount,
  ];
}

/**
 * One frame: each particle drifts, eases its size toward the ring's pull and points away from the ring
 * centre. `sizes` are last frame's (missing ones snap to target); a `dt` of 0 snaps every size.
 */
export function advance(
  particles: readonly Particle[],
  sizes: readonly number[],
  ring: Ring,
  seconds: number,
  dt: number,
  noise: Noise3,
): { sizes: number[]; marks: Mark[] } {
  const blend = dt > 0 ? easing(dt, SIZE_SECONDS) : 1;
  const nextSizes: number[] = [];
  const marks = particles.map((particle, i): Mark => {
    const sample = sampler(particle, seconds, noise);
    const [x, y] = drift(particle, sample);
    const angle = Math.atan2(y - ring.y, x - ring.x);
    const distance = Math.hypot(x - ring.x, y - ring.y) + sample(EDGE) * ring.wobble;
    const target = sizeTarget(distance, ring, sample(GRAIN));
    const previous = sizes[i] ?? target;
    const size = previous + (target - previous) * blend;
    nextSizes.push(size);
    const push = bandStrength(distance, ring) * BAND_PUSH;
    return {
      x: x + Math.cos(angle) * push,
      y: y + Math.sin(angle) * push,
      angle: angle + sample(TILT) * TILT.amount,
      size,
      visibility: particle.visibility,
    };
  });
  return { sizes: nextSizes, marks };
}

function strokeStyle(level: number, fade: number): Omit<Stroke, "segments"> {
  const share = fade / FADE_LEVELS;
  return level === 0
    ? { width: SPECK.width, alpha: SPECK.alpha * share }
    : { width: DASH.width + level * DASH.widthStep, alpha: (DASH.alpha + level * DASH.alphaStep) * share };
}

/** Groups marks into a few strokes by size and fade level, so a frame is a handful of draw calls. */
export function toStrokes(marks: readonly Mark[]): Stroke[] {
  const strokes = new Map<number, { width: number; alpha: number; segments: number[] }>();
  for (const mark of marks) {
    const fade = Math.min(FADE_LEVELS, Math.floor(mark.visibility * (FADE_LEVELS + 1)));
    if (fade === 0) {
      continue;
    }
    const level = Math.min(SIZE_LEVELS - 1, Math.floor(mark.size * SIZE_LEVELS));
    const key = level * (FADE_LEVELS + 1) + fade;
    const stroke = strokes.get(key) ?? { ...strokeStyle(level, fade), segments: [] };
    strokes.set(key, stroke);
    const half = level === 0 ? SPECK.halfLength : DASH.halfLength + mark.size * DASH.stretch;
    const dx = Math.cos(mark.angle) * half;
    const dy = Math.sin(mark.angle) * half;
    stroke.segments.push(mark.x - dx, mark.y - dy, mark.x + dx, mark.y + dy);
  }
  return [...strokes.values()];
}
