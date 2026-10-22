"use client";

import { useEffect, useRef } from "react";
import { HOME, type Particle, type Point, scatterDots, shadowAlpha, step } from "@/lib/dot-field";

/** Only a real mouse floats the dots; touch and pen moves usually mean scrolling or tapping. */
const HOVER_POINTER = "mouse";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const SEED = 7;
/** Caps one animation step, so a dropped or throttled frame can't make the dots jump. */
const MAX_STEP_SECONDS = 0.1;
const MS_PER_SECOND = 1000;
const FULL_TURN = Math.PI * 2;
const SHADOW = { drop: 2, width: 1.6, height: 0.7 };

interface Scene {
  readonly particles: Particle[];
  readonly width: number;
  readonly height: number;
}

/** Sizes the canvas for the screen and scatters a fresh set of dots around the measured column. */
function layout(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, column: HTMLElement): Scene {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ratio = window.devicePixelRatio;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillStyle = getComputedStyle(canvas).color;
  const dots = scatterDots({ width, height, column: column.offsetWidth }, SEED);
  return { particles: dots.map((dot) => ({ dot, offset: HOME })), width, height };
}

function paint(context: CanvasRenderingContext2D, { particles, width, height }: Scene) {
  context.clearRect(0, 0, width, height);
  for (const { dot, offset } of particles) {
    const shadow = shadowAlpha(offset[1]);
    if (shadow > 0) {
      context.globalAlpha = shadow;
      context.beginPath();
      context.ellipse(dot.x, dot.y + SHADOW.drop, dot.radius * SHADOW.width, dot.radius * SHADOW.height, 0, 0, FULL_TURN);
      context.fill();
    }
    context.globalAlpha = dot.alpha;
    context.beginPath();
    context.arc(dot.x + offset[0], dot.y + offset[1], dot.radius, 0, FULL_TURN);
    context.fill();
  }
}

/** Draws the field and floats nearby dots while the mouse is over the page. Returns the cleanup. */
function runField(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, column: HTMLElement): () => void {
  const reducedMotion = window.matchMedia(REDUCED_MOTION);
  let scene = layout(canvas, context, column);
  let pointer: Point | null = null;
  let frame = 0;
  let last: number | null = null;
  const tick = (now: number) => {
    const dt = last === null ? 0 : Math.min(MAX_STEP_SECONDS, (now - last) / MS_PER_SECOND);
    const next = step(scene.particles, pointer, now / MS_PER_SECOND, dt);
    scene = { ...scene, particles: next.particles };
    paint(context, scene);
    last = next.moving ? now : null;
    frame = next.moving ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => {
    frame ||= requestAnimationFrame(tick);
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== HOVER_POINTER) {
      return;
    }
    pointer = reducedMotion.matches ? null : [event.clientX, event.clientY];
    wake();
  };
  const onLeave = () => {
    pointer = null;
    wake();
  };
  const onResize = () => {
    scene = layout(canvas, context, column);
    paint(context, scene);
  };
  const root = document.documentElement;
  window.addEventListener("pointermove", onMove, { passive: true });
  root.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", onResize);
  paint(context, scene);
  return () => {
    window.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", onResize);
    cancelAnimationFrame(frame);
  };
}

/** Grey dots scattered around the text column; the ones near the mouse float up and bob. Decorative only. */
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
