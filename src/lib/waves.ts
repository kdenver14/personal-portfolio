/**
 * Parallel wavy lines for the corner decoration. Each line sums a primary sine, a secondary sine and a slow
 * swell; every one of them repeats over wavePeriod(wavelength), so sliding the art by that distance along the
 * lines lands on an identical picture and the drift animation loops without a seam.
 */
export interface WaveOptions {
  /** Square canvas size; lines overshoot it so the art still fills the square after rotation. */
  size: number;
  lines: number;
  /** Horizontal distance between sampled points. */
  step: number;
  wavelength: number;
  minAmplitude: number;
  maxAmplitude: number;
  /** Phase added per line, in radians: small values keep neighbours nearly parallel. */
  phaseStep: number;
  maxStroke: number;
  minStroke: number;
  /** Line position (0 = first, 1 = last) where the stroke is thickest, and where it has thinned to minStroke. */
  thickAt: number;
  thinAt: number;
  /** Extra length added to the end of every line, so the art still covers the canvas while it slides. */
  extend: number;
}

export interface WaveLine {
  d: string;
  strokeWidth: number;
}

const OVERSHOOT = 0.35;
/** The secondary wave and the swell repeat every 1.5 and 3 wavelengths, so 3 wavelengths is the common period. */
const SECOND_WAVE_RATIO = 1.5;
const SWELL_RATIO = 3;
const PERIOD_RATIO = 3;
const SECOND_WAVE_WEIGHT = 0.35;
const SECOND_PHASE_RATIO = 0.6;
const SWELL_DEPTH = 0.55;
const SWELL_PHASE_PER_LINE = 0.07;
/** Phase drift is bent so neighbouring lines converge and spread, as in op-art moiré. */
const DRIFT_BEND = 1.4;
const DRIFT_BEND_RATE = 0.11;
const STROKE_DECIMALS = 2;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

/** Distance after which every line repeats exactly. */
export function wavePeriod(wavelength: number): number {
  return wavelength * PERIOD_RATIO;
}

export function waveY(x: number, base: number, amplitude: number, phase: number, wavelength: number, index: number): number {
  const swell = 1 + SWELL_DEPTH * Math.sin((2 * Math.PI * x) / (wavelength * SWELL_RATIO) + index * SWELL_PHASE_PER_LINE);
  const primary = Math.sin((2 * Math.PI * x) / wavelength + phase);
  const secondary = Math.sin((2 * Math.PI * x) / (wavelength * SECOND_WAVE_RATIO) + phase * SECOND_PHASE_RATIO);
  return base + amplitude * swell * (primary + SECOND_WAVE_WEIGHT * secondary);
}

function linePath(index: number, options: WaveOptions): string {
  const { size, lines, step, wavelength, minAmplitude, maxAmplitude, phaseStep, extend } = options;
  const span = size * (1 + 2 * OVERSHOOT);
  const u = lines > 1 ? index / (lines - 1) : 0;
  const base = -size * OVERSHOOT + u * span;
  const amplitude = lerp(minAmplitude, maxAmplitude, 0.5 + 0.5 * Math.sin(u * Math.PI * 1.3));
  const phase = index * phaseStep + DRIFT_BEND * Math.sin(index * DRIFT_BEND_RATE);
  const points: string[] = [];
  for (let x = -size * OVERSHOOT; x <= size * (1 + OVERSHOOT) + extend; x += step) {
    points.push(`${Math.round(x)} ${Math.round(waveY(x, base, amplitude, phase, wavelength, index))}`);
  }
  return `M${points.join("L")}`;
}

export function waveLines(options: WaveOptions): WaveLine[] {
  if (options.lines < 1 || options.step <= 0 || options.wavelength <= 0 || options.thinAt <= options.thickAt) {
    throw new RangeError("waveLines needs at least one line, a positive step and wavelength, and thinAt after thickAt");
  }
  return Array.from({ length: options.lines }, (_, index) => {
    const u = options.lines > 1 ? index / (options.lines - 1) : 0;
    const thinning = clamp01((u - options.thickAt) / (options.thinAt - options.thickAt));
    return {
      d: linePath(index, options),
      strokeWidth: Number(lerp(options.maxStroke, options.minStroke, thinning).toFixed(STROKE_DECIMALS)),
    };
  });
}
