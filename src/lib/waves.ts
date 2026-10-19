/**
 * Squiggly arcs for the corner decoration, after Material 3's wavy progress indicator: circles around the
 * canvas origin (the page corner) whose radius swings like a sine wave.
 *
 * Every arc carries a whole number of waves per full turn, so turning it by one wave (360° / lobes) lands it
 * exactly on itself. A CSS animation can repeat that turn forever and the wave drifts along the arc without
 * a seam.
 */
export interface SquiggleOptions {
  /** Mean radius of the arc. */
  radius: number;
  /** Target length of one wave along the arc; rounded so a full turn holds whole waves. */
  wavelength: number;
  /** Height of the wave either side of the mean radius. */
  amplitude: number;
}

export interface Squiggle {
  d: string;
  /** Waves per full turn. */
  lobes: number;
}

type Point = readonly [number, number];

/** Each wave is drawn as this many cubic Béziers with exact tangents, which keeps thick strokes smooth. */
const SEGMENTS_PER_LOBE = 4;
/** Extra angle, in radians, past one wave beyond each edge of the quarter turn. */
const OVERHANG = 0.1;
const MIN_LOBES = 3;
const DECIMALS = 1;
const TURN = 2 * Math.PI;

export function lobeCount(radius: number, wavelength: number): number {
  return Math.max(MIN_LOBES, Math.round((TURN * radius) / wavelength));
}

export function squiggleRadius(theta: number, options: SquiggleOptions, lobes: number): number {
  return options.radius + options.amplitude * Math.sin(lobes * theta);
}

/** Angles the arc spans: the quarter turn plus one wave and a little more on both sides, so a turn never shows an end. */
export function arcSpan(lobes: number): { start: number; end: number } {
  const margin = TURN / lobes + OVERHANG;
  return { start: -margin, end: Math.PI / 2 + margin };
}

function pointAt(theta: number, options: SquiggleOptions, lobes: number): Point {
  const r = squiggleRadius(theta, options, lobes);
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

/** Derivative of pointAt with respect to theta. */
function tangentAt(theta: number, options: SquiggleOptions, lobes: number): Point {
  const r = squiggleRadius(theta, options, lobes);
  const dr = options.amplitude * lobes * Math.cos(lobes * theta);
  return [dr * Math.cos(theta) - r * Math.sin(theta), dr * Math.sin(theta) + r * Math.cos(theta)];
}

const coords = ([x, y]: Point): string => `${x.toFixed(DECIMALS)} ${y.toFixed(DECIMALS)}`;

/** Hermite-to-Bézier: control points sit a third of the step along each end's tangent. */
function curveTo(from: number, to: number, options: SquiggleOptions, lobes: number): string {
  const third = (to - from) / 3;
  const [x0, y0] = pointAt(from, options, lobes);
  const [dx0, dy0] = tangentAt(from, options, lobes);
  const [dx1, dy1] = tangentAt(to, options, lobes);
  const end = pointAt(to, options, lobes);
  return `C${coords([x0 + dx0 * third, y0 + dy0 * third])} ${coords([end[0] - dx1 * third, end[1] - dy1 * third])} ${coords(end)}`;
}

export function squiggleArc(options: SquiggleOptions): Squiggle {
  const { radius, wavelength, amplitude } = options;
  if (radius <= 0 || wavelength <= 0 || amplitude < 0 || amplitude >= radius) {
    throw new RangeError("squiggleArc needs a positive radius and wavelength, and 0 <= amplitude < radius");
  }
  const lobes = lobeCount(radius, wavelength);
  const { start, end } = arcSpan(lobes);
  const count = Math.ceil(((end - start) * lobes * SEGMENTS_PER_LOBE) / TURN);
  const step = (end - start) / count;
  const curves = Array.from({ length: count }, (_, k) => curveTo(start + k * step, start + (k + 1) * step, options, lobes));
  return { d: `M${coords(pointAt(start, options, lobes))}${curves.join("")}`, lobes };
}
