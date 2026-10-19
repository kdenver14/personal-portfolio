/**
 * Concentric wavy rings for the corner decoration, centred on the canvas origin (the page corner).
 *
 * The set is self-similar: ring i+1 is ring i scaled by `growth` and turned by rippleTurn(). So scaling and
 * turning the whole drawing by exactly that much puts every ring where the next one was, which lets a CSS
 * animation ripple the rings outward forever without a seam. Stroke widths grow with the radius for the
 * same reason.
 */
export interface RingOptions {
  /** Radius of the innermost ring. */
  innerRadius: number;
  /** Rings continue until they pass this radius. */
  outerRadius: number;
  /** Radius ratio between neighbouring rings (> 1). */
  growth: number;
  /** Wave lobes per full turn. */
  lobes: number;
  /** Wave height as a share of the ring's radius. */
  amplitude: number;
  /** Phase added per ring, in radians: it twists the lobes from ring to ring. */
  phaseStep: number;
  /** Stroke width as a share of the ring's radius. */
  strokeRatio: number;
  /** Distance between sampled points along a ring. */
  step: number;
}

export interface WaveLine {
  d: string;
  strokeWidth: number;
}

/** Arcs run a little past the quarter turn so slight rotation never exposes their ends. */
const ARC_START = -0.15;
const ARC_END = Math.PI / 2 + 0.15;
const MIN_POINTS = 16;
/** A slower swell along each ring makes the lobes bunch and relax like water. */
const SWELL_RATIO = 0.25;
const SWELL_DEPTH = 0.45;
const STROKE_DECIMALS = 3;

export function ringCount(options: RingOptions): number {
  return Math.ceil(Math.log(options.outerRadius / options.innerRadius) / Math.log(options.growth)) + 1;
}

/** Radius of ring `index` at angle `theta`. */
export function ringRadius(index: number, theta: number, options: RingOptions): number {
  const { innerRadius, growth, lobes, amplitude, phaseStep } = options;
  const base = innerRadius * growth ** index;
  const phase = index * phaseStep;
  const swell = 1 + SWELL_DEPTH * Math.sin(lobes * SWELL_RATIO * theta + SWELL_RATIO * phase);
  return base * (1 + amplitude * swell * Math.sin(lobes * theta + phase));
}

/** Turn, in degrees, that carries one ring's lobes onto the next ring's (pairs with a scale of `growth`). */
export function rippleTurn(options: RingOptions): number {
  return (-options.phaseStep / options.lobes) * (180 / Math.PI);
}

function ringPath(index: number, options: RingOptions): string {
  const base = options.innerRadius * options.growth ** index;
  const count = Math.max(MIN_POINTS, Math.ceil((base * (ARC_END - ARC_START)) / options.step));
  const points: string[] = [];
  for (let k = 0; k <= count; k += 1) {
    const theta = ARC_START + ((ARC_END - ARC_START) * k) / count;
    const r = ringRadius(index, theta, options);
    points.push(`${(r * Math.cos(theta)).toFixed(1)} ${(r * Math.sin(theta)).toFixed(1)}`);
  }
  return `M${points.join("L")}`;
}

export function waveRings(options: RingOptions): WaveLine[] {
  if (options.innerRadius <= 0 || options.outerRadius <= options.innerRadius || options.growth <= 1 || options.step <= 0) {
    throw new RangeError("waveRings needs 0 < innerRadius < outerRadius, growth > 1 and a positive step");
  }
  return Array.from({ length: ringCount(options) }, (_, index) => ({
    d: ringPath(index, options),
    strokeWidth: Number((options.strokeRatio * options.innerRadius * options.growth ** index).toFixed(STROKE_DECIMALS)),
  }));
}
