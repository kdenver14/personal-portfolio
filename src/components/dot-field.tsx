"use client";

import { useEffect, useRef } from "react";
import {
  type Field,
  type Particle,
  type Point,
  type Stroke,
  advance,
  easeToward,
  idleCentre,
  pointerCentre,
  ringAt,
  scatterParticles,
  seededRandom,
  toStrokes,
} from "@/lib/dot-field";
import { type Noise3, createNoise3 } from "@/lib/noise";

/** Only a real mouse steers the ring; touch and pen moves usually mean scrolling or tapping. */
const HOVER_POINTER = "mouse";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const SCATTER_SEED = 7;
const NOISE_SEED = 42;
/** Seconds for the ring to cover about 63% of the way to the cursor: the lag that makes it feel liquid. */
const RING_SECONDS = 0.45;
/** Caps one animation step, so a dropped or throttled frame can't make the field jump. */
const MAX_STEP_SECONDS = 0.1;
const MS_PER_SECOND = 1000;

interface Scene {
  readonly field: Field;
  readonly particles: Particle[];
  readonly sizes: number[];
}

/** Sizes the canvas for the screen and scatters particles around the measured column. */
function layout(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, column: HTMLElement): Scene {
  const field = { width: canvas.clientWidth, height: canvas.clientHeight, column: column.offsetWidth };
  const ratio = window.devicePixelRatio;
  canvas.width = Math.round(field.width * ratio);
  canvas.height = Math.round(field.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.strokeStyle = getComputedStyle(canvas).color;
  context.lineCap = "round";
  return { field, particles: scatterParticles(field, SCATTER_SEED), sizes: [] };
}

function paint(context: CanvasRenderingContext2D, strokes: readonly Stroke[], { width, height }: Field) {
  context.clearRect(0, 0, width, height);
  for (const { width: lineWidth, alpha, segments } of strokes) {
    context.globalAlpha = alpha;
    context.lineWidth = lineWidth;
    context.beginPath();
    for (let i = 0; i + 3 < segments.length; i += 4) {
      context.moveTo(segments[i] ?? 0, segments[i + 1] ?? 0);
      context.lineTo(segments[i + 2] ?? 0, segments[i + 3] ?? 0);
    }
    context.stroke();
  }
}

/** Advances and draws one frame. The ring eases toward the mouse, or wanders when there is none. */
function createRenderer(context: CanvasRenderingContext2D, noise: Noise3) {
  let centre: Point | null = null;
  let last: number | null = null;
  return {
    reset() {
      last = null;
    },
    render(scene: Scene, pointer: Point | null, now: number): Scene {
      const seconds = now / MS_PER_SECOND;
      const dt = last === null ? 0 : Math.min(MAX_STEP_SECONDS, seconds - last);
      last = seconds;
      const target = pointer ? pointerCentre(pointer, scene.field, seconds) : idleCentre(scene.field, seconds);
      centre = centre && dt > 0 ? easeToward(centre, target, dt, RING_SECONDS) : (centre ?? target);
      const ring = ringAt(centre, scene.field, seconds);
      const next = advance(scene.particles, scene.sizes, ring, seconds, dt, noise);
      paint(context, toStrokes(next.marks), scene.field);
      return { ...scene, sizes: next.sizes };
    },
  };
}

/** Runs the field: animates while motion is allowed and particles are visible, else draws one still frame. */
function runField(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, column: HTMLElement): () => void {
  const reducedMotion = window.matchMedia(REDUCED_MOTION);
  const renderer = createRenderer(context, createNoise3(seededRandom(NOISE_SEED)));
  let scene = layout(canvas, context, column);
  let pointer: Point | null = null;
  let frame = 0;
  const loop = (now: number) => {
    scene = renderer.render(scene, pointer, now);
    frame = requestAnimationFrame(loop);
  };
  const restart = () => {
    cancelAnimationFrame(frame);
    renderer.reset();
    const still = reducedMotion.matches || scene.particles.length === 0;
    scene = renderer.render(scene, still ? null : pointer, performance.now());
    frame = still ? 0 : requestAnimationFrame(loop);
  };
  const onMove = (event: PointerEvent) => {
    pointer = event.pointerType === HOVER_POINTER ? [event.clientX, event.clientY] : pointer;
  };
  const onLeave = () => {
    pointer = null;
  };
  const onResize = () => {
    scene = layout(canvas, context, column);
    restart();
  };
  const listeners = new AbortController();
  const { signal } = listeners;
  window.addEventListener("pointermove", onMove, { passive: true, signal });
  document.documentElement.addEventListener("pointerleave", onLeave, { signal });
  window.addEventListener("resize", onResize, { signal });
  reducedMotion.addEventListener("change", restart, { signal });
  restart();
  return () => {
    listeners.abort();
    cancelAnimationFrame(frame);
  };
}

/** Grey dashes drifting across the page, quieter behind the text; a ring trailing the mouse swells them. Decorative only. */
export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const column = columnRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !column || !context) {
      return;
    }
    return runField(canvas, context, column);
  }, []);

  return (
    <div className="field" aria-hidden="true">
      <canvas ref={canvasRef} className="field-canvas" />
      <div ref={columnRef} className="field-column" />
    </div>
  );
}
