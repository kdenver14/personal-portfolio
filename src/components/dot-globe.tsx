"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import data from "@/data/land-dots.json";
import { HOME, LOCATION, TIME_ZONE } from "@/content/profile";
import { type GeoPoint, type Vec3, daylight, isNight, orthographic, subsolarPoint, toVector } from "@/lib/globe";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** Degrees the globe turns per ms on its own, and per px of drag. */
const SPIN_PER_MS = 0.006;
const DRAG_PER_PX = 0.4;
const MAX_TILT = 60;
/** It opens a little west of home and tilted north, so the Philippines sit centre right. */
const START_VIEW: GeoPoint = { lon: HOME.lon - 18, lat: 18 };
const RADIUS_SHARE = 0.44;
const MAX_STEP_MS = 64;
const DOT = { radius: 1.15, depthRadius: 0.55, nightAlpha: 0.3, dayAlpha: 0.45, limbFade: 2.2 };
const HOME_MARK = { radius: 4, reach: 14, pulseMs: 2000, ringAlpha: 0.6, labelGap: 10, labelFade: 3 };
const CLOCK_REFRESH_MS = 30_000;

/** The land dots, checked at the boundary: [longitude, latitude] pairs written by scripts/land-dots.mjs. */
function parseDots(value: unknown): GeoPoint[] {
  if (!Array.isArray(value)) {
    throw new Error("land-dots.json must be an array");
  }
  return value.map((pair: unknown) => {
    if (!Array.isArray(pair) || typeof pair[0] !== "number" || typeof pair[1] !== "number") {
      throw new Error("land-dots.json holds a malformed point");
    }
    return { lon: pair[0], lat: pair[1] };
  });
}

const LAND = parseDots(data).map((place) => ({ place, vector: toVector(place) }));

interface Palette {
  ink: string;
  blue: string;
  paper: string;
  shade: string;
  rim: string;
}

function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string) => style.getPropertyValue(`--color-${name}`).trim();
  return { ink: token("ink"), blue: token("blue"), paper: token("paper"), shade: token("panel-hover"), rim: token("line-strong") };
}

interface Disc {
  cx: number;
  cy: number;
  r: number;
}

function paintSphere(context: CanvasRenderingContext2D, { cx, cy, r }: Disc, palette: Palette) {
  const fill = context.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
  fill.addColorStop(0, palette.paper);
  fill.addColorStop(1, palette.shade);
  context.globalAlpha = 1;
  context.fillStyle = fill;
  context.strokeStyle = palette.rim;
  context.lineWidth = 1;
  context.beginPath();
  context.arc(cx, cy, r, 0, Math.PI * 2);
  context.fill();
  context.stroke();
}

/** Land on the visible face: bright by day, dim by night, fading toward the rim. */
function paintLand(context: CanvasRenderingContext2D, disc: Disc, view: GeoPoint, sun: Vec3, palette: Palette) {
  context.fillStyle = palette.ink;
  for (const { place, vector } of LAND) {
    const p = orthographic(place, view);
    if (p.z <= 0) {
      continue;
    }
    context.globalAlpha = (DOT.nightAlpha + DOT.dayAlpha * daylight(vector, sun)) * Math.min(1, p.z * DOT.limbFade);
    context.beginPath();
    context.arc(disc.cx + p.x * disc.r, disc.cy + p.y * disc.r, DOT.radius + DOT.depthRadius * p.z, 0, Math.PI * 2);
    context.fill();
  }
}

/** Home as a blue dot with a ring pulsing out of it; moves the label beside it, or hides it round the back. */
function paintHome(context: CanvasRenderingContext2D, disc: Disc, view: GeoPoint, palette: Palette, pulse: number, label: HTMLElement) {
  const p = orthographic(HOME, view);
  label.style.opacity = String(Math.max(0, Math.min(1, p.z * HOME_MARK.labelFade)));
  if (p.z <= 0) {
    return;
  }
  const x = disc.cx + p.x * disc.r;
  const y = disc.cy + p.y * disc.r;
  context.strokeStyle = palette.blue;
  context.fillStyle = palette.blue;
  context.lineWidth = 1.5;
  context.globalAlpha = HOME_MARK.ringAlpha * (1 - pulse);
  context.beginPath();
  context.arc(x, y, HOME_MARK.radius + pulse * HOME_MARK.reach, 0, Math.PI * 2);
  context.stroke();
  context.globalAlpha = 1;
  context.beginPath();
  context.arc(x, y, HOME_MARK.radius, 0, Math.PI * 2);
  context.fill();
  label.style.transform = `translate(${x + HOME_MARK.labelGap}px, ${y - HOME_MARK.labelGap}px)`;
}

/** Sizes the canvas to its box at the screen's pixel density; returns the globe's disc in CSS pixels. */
function fit(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): Disc {
  const { clientWidth: width, clientHeight: height } = canvas;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { cx: width / 2, cy: height / 2, r: Math.min(width, height) * RADIUS_SHARE };
}

/** Turns the view by dragging; a mostly vertical touch drag is left to scroll the page (touch-action: pan-y). */
function listenForDrag(stage: HTMLElement, signal: AbortSignal, view: { current: GeoPoint }, onTurn: () => void) {
  let drag: { x: number; y: number; from: GeoPoint } | null = null;
  const end = () => {
    drag = null;
  };
  stage.addEventListener("pointerdown", (event) => {
    drag = { x: event.clientX, y: event.clientY, from: view.current };
    stage.setPointerCapture(event.pointerId);
  }, { signal });
  stage.addEventListener("pointermove", (event) => {
    if (!drag) {
      return;
    }
    const lat = drag.from.lat + (event.clientY - drag.y) * DRAG_PER_PX;
    view.current = { lon: drag.from.lon - (event.clientX - drag.x) * DRAG_PER_PX, lat: Math.max(-MAX_TILT, Math.min(MAX_TILT, lat)) };
    onTurn();
  }, { signal });
  stage.addEventListener("pointerup", end, { signal });
  stage.addEventListener("pointercancel", end, { signal });
  return () => drag !== null;
}

/** Redraws on resize, and tracks whether the globe is on screen, so it only animates when someone can see it. */
function watchStage(stage: HTMLElement, canvas: HTMLCanvasElement, onResize: () => void, onVisible: (visible: boolean) => void) {
  const resize = new ResizeObserver(onResize);
  const seen = new IntersectionObserver(([entry]) => onVisible(entry?.isIntersecting ?? false));
  resize.observe(canvas);
  seen.observe(stage);
  return () => {
    resize.disconnect();
    seen.disconnect();
  };
}

/** Spins the globe while motion is allowed and it is on screen; otherwise redraws only when dragged. */
function runGlobe(stage: HTMLElement, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, label: HTMLElement) {
  const reducedMotion = window.matchMedia(REDUCED_MOTION);
  const palette = readPalette();
  const listeners = new AbortController();
  const view = { current: START_VIEW };
  let disc = fit(canvas, context);
  let visible = false;
  let frame = 0;
  let last: number | null = null;
  const dragging = listenForDrag(stage, listeners.signal, view, () => {
    if (reducedMotion.matches || !visible) {
      redraw();
    }
  });
  const draw = (now: number) => {
    const moving = !reducedMotion.matches;
    const step = last === null ? 0 : Math.min(MAX_STEP_MS, now - last);
    last = now;
    view.current = moving && !dragging() ? { ...view.current, lon: view.current.lon + step * SPIN_PER_MS } : view.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    paintSphere(context, disc, palette);
    paintLand(context, disc, view.current, toVector(subsolarPoint(new Date())), palette);
    paintHome(context, disc, view.current, palette, moving ? (now % HOME_MARK.pulseMs) / HOME_MARK.pulseMs : 0, label);
    frame = moving && visible ? requestAnimationFrame(draw) : 0;
  };
  function redraw() {
    cancelAnimationFrame(frame);
    last = null;
    draw(performance.now());
  }
  reducedMotion.addEventListener("change", redraw, { signal: listeners.signal });
  const unwatch = watchStage(stage, canvas, () => {
    disc = fit(canvas, context);
    redraw();
  }, (isVisible) => {
    visible = isVisible;
    redraw();
  });
  return () => {
    listeners.abort();
    unwatch();
    cancelAnimationFrame(frame);
  };
}

const formatTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE });

function subscribeClock(onChange: () => void): () => void {
  const timer = window.setInterval(onChange, CLOCK_REFRESH_MS);
  return () => window.clearInterval(timer);
}

/** Home's local time and whether it is night there; empty on the server, so the build doesn't freeze a time. */
function useHomeClock(): { time: string; night: boolean } | null {
  const snapshot = useSyncExternalStore(
    subscribeClock,
    () => {
      const now = new Date();
      return `${formatTime.format(now)}|${isNight(HOME, now) ? "night" : "day"}`;
    },
    () => null,
  );
  if (!snapshot) {
    return null;
  }
  const [time = "", phase] = snapshot.split("|");
  return { time, night: phase === "night" };
}

/**
 * A dot globe that spins slowly, lit by the real sun right now, with home marked in blue and its local time.
 * Drag to turn it. The drawing is decorative; the caption carries the place and time.
 */
export function DotGlobe() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const clock = useHomeClock();

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const label = labelRef.current;
    const context = canvas?.getContext("2d");
    if (!stage || !canvas || !label || !context) {
      return;
    }
    return runGlobe(stage, canvas, context, label);
  }, []);

  return (
    <figure className="panel globe">
      <div ref={stageRef} className="globe-stage" aria-hidden="true">
        <canvas ref={canvasRef} className="globe-canvas" />
        <span ref={labelRef} className="globe-pin">
          <span className="globe-pin-name">{HOME.name}</span>
          <span className="globe-pin-time">{clock ? `${clock.time} · ${clock.night ? "night" : "day"}` : " "}</span>
        </span>
      </div>
      <figcaption className="globe-caption">
        <strong>{LOCATION}</strong>
        {clock ? ` · it's ${clock.time} here (UTC+8).` : " · UTC+8."} Lit by the real sun right now; drag to spin.
      </figcaption>
    </figure>
  );
}
