"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  AVAILABILITY,
  EMAIL_DOMAIN,
  EMAIL_URL,
  EMAIL_USER,
  GITHUB_URL,
  LANGUAGES,
  LOCATION_SHORT,
  NAME,
  OWNER,
  ROLE,
  TIME_ZONE,
} from "@/content/profile";
import {
  type Grip,
  type Lanyard,
  STRAP_LENGTH,
  follow,
  grab,
  hanging,
  isResting,
  jolt,
  letGo,
  offsetFromRest,
  raised,
  stepLanyard,
} from "@/lib/lanyard";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** How much of the stage must show before a waiting badge drops in. */
const DROP_THRESHOLD = 0.35;
/** The strap runs this far past the card's top edge, so it ends inside the slot. */
const STRAP_INTO_SLOT = 14;
const CLOCK_REFRESH_MS = 30_000;
/** The family name goes on its own line, as on a printed badge. */
const NAME_BREAK = NAME.lastIndexOf(" ");

interface Rig {
  lanyard: Lanyard;
  anchorX: number;
  visible: boolean;
  /** Waiting out of sight above the stage until enough of it shows; done once it has dropped. */
  drop: "waiting" | "done";
  grip: Grip | null;
}

function place(card: HTMLElement, strap: SVGLineElement, rig: Rig) {
  const { lanyard, anchorX } = rig;
  const { x, y } = offsetFromRest(lanyard);
  card.style.transform = `translate(${x}px, ${y}px) rotate(${-lanyard.angle}rad)`;
  const reach = lanyard.length + STRAP_INTO_SLOT;
  strap.setAttribute("x1", String(anchorX));
  strap.setAttribute("x2", String(anchorX + reach * Math.sin(lanyard.angle)));
  strap.setAttribute("y2", String(reach * Math.cos(lanyard.angle)));
  strap.setAttribute("visibility", lanyard.length > 0 ? "visible" : "hidden");
}

/** Steps the physics only while the badge is on screen and moving, so a hanging badge costs nothing. */
function createLoop(rig: Rig, render: () => void) {
  let frame = 0;
  let last: number | null = null;
  const tick = (now: number) => {
    rig.lanyard = rig.grip ? rig.lanyard : stepLanyard(rig.lanyard, last === null ? 0 : now - last);
    last = now;
    render();
    frame = rig.visible && (rig.grip !== null || !isResting(rig.lanyard)) ? requestAnimationFrame(tick) : 0;
  };
  return {
    wake: () => {
      if (frame === 0 && rig.visible && rig.drop !== "waiting") {
        last = null;
        frame = requestAnimationFrame(tick);
      }
    },
    stop: () => cancelAnimationFrame(frame),
  };
}

const pointerAngle = (stage: HTMLElement, anchorX: number, event: PointerEvent) => {
  const box = stage.getBoundingClientRect();
  return Math.atan2(event.clientX - box.left - anchorX, event.clientY - box.top);
};

/** Swings the badge by dragging it. Links on it still click, and vertical touch drags scroll (touch-action: pan-y). */
function listenForDrag(stage: HTMLElement, card: HTMLElement, rig: Rig, signal: AbortSignal, onChange: (released: boolean) => void) {
  card.addEventListener("pointerdown", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      return;
    }
    rig.grip = grab(rig.lanyard, pointerAngle(stage, rig.anchorX, event), event.timeStamp);
    card.setPointerCapture(event.pointerId);
    onChange(false);
  }, { signal });
  card.addEventListener("pointermove", (event) => {
    if (rig.grip) {
      ({ lanyard: rig.lanyard, grip: rig.grip } = follow(rig.lanyard, rig.grip, pointerAngle(stage, rig.anchorX, event), event.timeStamp));
      onChange(false);
    }
  }, { signal });
  const release = (event: PointerEvent) => {
    if (rig.grip) {
      rig.lanyard = letGo(rig.lanyard, rig.grip, event.timeStamp);
      rig.grip = null;
      onChange(true);
    }
  };
  card.addEventListener("pointerup", release, { signal });
  card.addEventListener("pointercancel", release, { signal });
}

function listenForScroll(signal: AbortSignal, onScroll: (scrolledPx: number) => void) {
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    onScroll(window.scrollY - lastY);
    lastY = window.scrollY;
  }, { passive: true, signal });
}

/** A waiting badge drops in once enough of the stage shows, whether that is at load or further down the page. */
function updateDrop(rig: Rig, ratio: number) {
  if (rig.drop === "waiting" && ratio >= DROP_THRESHOLD) {
    rig.drop = "done";
  }
}

function watchStage(stage: HTMLElement, onResize: () => void, onSeen: (entry: IntersectionObserverEntry) => void) {
  const resize = new ResizeObserver(onResize);
  const seen = new IntersectionObserver(([entry]) => entry && onSeen(entry), { threshold: [0, DROP_THRESHOLD] });
  resize.observe(stage);
  seen.observe(stage);
  return () => {
    resize.disconnect();
    seen.disconnect();
  };
}

function runLanyard(stage: HTMLElement, card: HTMLElement, strap: SVGLineElement) {
  const still = window.matchMedia(REDUCED_MOTION).matches;
  const listeners = new AbortController();
  const rig: Rig = {
    lanyard: still ? hanging() : raised(card.offsetHeight),
    anchorX: stage.clientWidth / 2,
    visible: false,
    drop: still ? "done" : "waiting",
    grip: null,
  };
  const render = () => place(card, strap, rig);
  const loop = createLoop(rig, render);
  // Placed before it is revealed (see .badge-stage[data-live]), so no frame paints the card at rest before it drops.
  render();
  stage.dataset.live = "";
  listenForDrag(stage, card, rig, listeners.signal, (released) => {
    if (!still) {
      loop.wake();
      return;
    }
    rig.lanyard = released ? hanging() : rig.lanyard;
    render();
  });
  listenForScroll(listeners.signal, (scrolledPx) => {
    if (!still && rig.visible && rig.drop === "done") {
      rig.lanyard = jolt(rig.lanyard, scrolledPx);
      loop.wake();
    }
  });
  const unwatch = watchStage(stage, () => {
    rig.anchorX = stage.clientWidth / 2;
    render();
  }, (entry) => {
    rig.visible = entry.isIntersecting;
    updateDrop(rig, entry.intersectionRatio);
    render();
    loop.wake();
  });
  return () => {
    listeners.abort();
    unwatch();
    loop.stop();
  };
}

const formatTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE });

function subscribeClock(onChange: () => void): () => void {
  const timer = window.setInterval(onChange, CLOCK_REFRESH_MS);
  return () => window.clearInterval(timer);
}

/** Home's local time; null on the server, so the build doesn't freeze a time into the page. */
function useHomeTime(): string | null {
  return useSyncExternalStore(subscribeClock, () => formatTime.format(new Date()), () => null);
}

/**
 * An ID badge on a blue strap, carrying the chip's facts: home and its local time, languages, GitHub and email.
 * It drops in when first reached, swings when dragged and bobs when the page scrolls. The strap is decorative.
 */
export function Badge() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<SVGLineElement>(null);
  const time = useHomeTime();

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const strap = strapRef.current;
    if (!stage || !card || !strap) {
      return;
    }
    return runLanyard(stage, card, strap);
  }, []);

  return (
    <figure className="panel badge">
      <div ref={stageRef} className="badge-stage" style={{ paddingTop: STRAP_LENGTH }}>
        <span className="badge-anchor" aria-hidden="true" />
        <svg className="badge-strap" aria-hidden="true">
          <line ref={strapRef} x1="50%" y1="0" x2="50%" y2={STRAP_LENGTH + STRAP_INTO_SLOT} />
        </svg>
        <div ref={cardRef} className="badge-card">
          <span className="badge-slot" aria-hidden="true" />
          <p className="badge-role">{ROLE}</p>
          <p className="badge-name">
            {NAME.slice(0, NAME_BREAK)}
            <br />
            {NAME.slice(NAME_BREAK + 1)}
          </p>
          <dl className="badge-facts">
            <div>
              <dt>Home</dt>
              <dd>
                {LOCATION_SHORT}
                {time && <span className="badge-time"> · {time}</span>}
              </dd>
            </div>
            <div>
              <dt>Writes</dt>
              <dd>{LANGUAGES}</dd>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">{OWNER}</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={EMAIL_URL}>{EMAIL_USER}@<wbr />{EMAIL_DOMAIN}</a>
              </dd>
            </div>
          </dl>
          <p className="badge-band">{AVAILABILITY}</p>
        </div>
      </div>
      <figcaption className="badge-note">Drag the badge. It sways when you scroll, too.</figcaption>
    </figure>
  );
}
