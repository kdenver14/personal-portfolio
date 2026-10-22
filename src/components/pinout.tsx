"use client";

import { type CSSProperties, Fragment, type PointerEvent, useState } from "react";
import type { Pin } from "@/domain/datasheet";
import { PIN_SUBLABELS, PINS } from "@/content/pins";
import { PART_NUMBER } from "@/content/profile";
import { CHIP, type Rect, type Side, UNITS_PER_REM, bondWire, dieRect, packageHeight } from "@/lib/chip";
import { LocalClock } from "./local-clock";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const DATE_CODE = "2246 PH";
const IDLE_READOUT = "Me, as an 8-pin chip. Hover or tap a pin.";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** Degrees the chip tilts with the cursor at the figure's edges. */
const TILT = { x: 14, y: 18 } as const;
/** Where the lid's highlight sits at rest, and how far it follows the cursor, in % of the lid. */
const SHEEN = { x: 50, y: 30, range: 90 } as const;
const POINTER_VARS = ["--rx", "--ry", "--mx", "--my"] as const;
const FACES = ["left", "right", "top", "bottom"] as const;

/** The figure's layout as custom properties, from the same numbers that place the bond wires. */
const LAYOUT_VARS: CSSVars = {
  "--chip-width": `${CHIP.width}rem`,
  "--chip-height": `${packageHeight()}rem`,
  "--chip-inset": `${CHIP.inset}rem`,
  "--chip-row": `${CHIP.row}rem`,
  "--chip-depth": `${CHIP.depth}rem`,
};

type SetActive = (pin: number | null) => void;

function pinHandlers(pin: number, setActive: SetActive) {
  return {
    onMouseEnter: () => setActive(pin),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(pin),
    onBlur: () => setActive(null),
  };
}

function PinSublabel({ pin }: { pin: Pin }) {
  if (pin.name === "CLK") {
    return <LocalClock suffix=" PHT" />;
  }
  return <>{PIN_SUBLABELS[pin.name]}</>;
}

interface PinLeadProps {
  pin: Pin;
  side: "left" | "right";
  isActive: boolean;
  setActive: SetActive;
}

function PinLead({ pin, side, isActive, setActive }: PinLeadProps) {
  const className = `pin pin-${side}${isActive ? " is-active" : ""}`;
  const label = `Pin ${pin.number}, ${pin.name}: ${pin.description}`;
  const body = (
    <>
      <span className="pin-text">
        <span className="pin-name">{pin.name}</span>
        <span className="pin-sub">
          <PinSublabel pin={pin} />
        </span>
      </span>
      <span className="pin-leg" aria-hidden="true" />
    </>
  );

  if (pin.href) {
    const external = pin.href.startsWith("http");
    return (
      <a
        href={pin.href}
        className={className}
        aria-label={label}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...pinHandlers(pin.number, setActive)}
      >
        {body}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={() => setActive(pin.number)}
      {...pinHandlers(pin.number, setActive)}
    >
      {body}
    </button>
  );
}

const remBox = (rect: Rect): CSSProperties => ({
  left: `${rect.x}rem`,
  top: `${rect.y}rem`,
  width: `${rect.width}rem`,
  height: `${rect.height}rem`,
});

interface PackageProps {
  left: readonly Pin[];
  right: readonly Pin[];
  active: number | null;
}

/** What the lifted lid shows: the package's sides, and in its cavity the die wired to each leg's finger. */
function PackageInside({ left, right, active }: PackageProps) {
  const wires = (pins: readonly Pin[], side: Side) => pins.map((pin, i) => ({ pin, wire: bondWire(side, i) }));
  const all = [...wires(left, "left"), ...wires(right, "right")];
  return (
    <div className="package-inside" aria-hidden="true">
      {FACES.map((face) => <span key={face} className={`package-side package-side-${face}`} />)}
      <div className="package-cavity">
        <span className="package-die" style={remBox(dieRect())} />
        {all.map(({ pin, wire }) => (
          <Fragment key={pin.number}>
            <span className="package-finger" style={remBox(wire.finger)} />
            <span className="package-pad" style={remBox(wire.pad)} />
          </Fragment>
        ))}
        <svg className="package-wires" viewBox={`0 0 ${CHIP.width * UNITS_PER_REM} ${packageHeight() * UNITS_PER_REM}`}>
          {all.map(({ pin, wire }) => (
            <path key={pin.number} d={wire.path} className={active === pin.number ? "package-wire is-active" : "package-wire"} />
          ))}
        </svg>
      </div>
    </div>
  );
}

/** Tilts the chip toward the mouse and moves the lid's highlight with it; touch and reduced motion stay still. */
function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse" || window.matchMedia(REDUCED_MOTION).matches) {
    return;
  }
  const box = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;
  const { style } = event.currentTarget;
  style.setProperty("--rx", (-y * TILT.x).toFixed(2));
  style.setProperty("--ry", (x * TILT.y).toFixed(2));
  style.setProperty("--mx", `${(SHEEN.x + x * SHEEN.range).toFixed(1)}%`);
  style.setProperty("--my", `${(SHEEN.y + y * SHEEN.range).toFixed(1)}%`);
}

function untilt(event: PointerEvent<HTMLElement>) {
  for (const name of POINTER_VARS) {
    event.currentTarget.style.removeProperty(name);
  }
}

/** The lid: the top of the package, with its markings. */
function PackageBody({ left, right, active }: PackageProps) {
  const number = (pin: Pin, side: "l" | "r") => (
    <span key={pin.number} className={`body-num body-num-${side}${active === pin.number ? " is-active" : ""}`}>
      {pin.number}
    </span>
  );
  return (
    <div className="package" aria-hidden="true">
      <span className="package-notch" />
      <span className="package-dot" />
      <div className="package-nums">
        {left.map((pin, i) => [number(pin, "l"), right[i] ? number(right[i], "r") : null])}
      </div>
      <div className="package-mark">
        <span className="package-part">{PART_NUMBER}</span>
        <span className="package-date">{DATE_CODE}</span>
      </div>
    </div>
  );
}

/** Mirrors the focused or hovered pin's aria-label for sighted users, so it stays hidden from screen readers. */
function Readout({ active }: { active: number | null }) {
  const pin = PINS.find((p) => p.number === active);
  return (
    <p className="pin-readout" aria-hidden="true">
      {pin ? (
        <>
          <span className="pin-readout-key">{pin.name}</span> {pin.description}
        </>
      ) : (
        IDLE_READOUT
      )}
    </p>
  );
}

/**
 * Me as a DIP-8 chip in 3D. It sways slowly and tilts toward the mouse. Hovering the figure, or picking a
 * pin, lifts the lid off the die, and the picked pin's bond wire lights.
 */
export function PinFigure() {
  const [active, setActive] = useState<number | null>(null);
  const left = PINS.slice(0, CHIP.pinsPerSide);
  const right = PINS.slice(CHIP.pinsPerSide).toReversed();
  const column = (pins: readonly Pin[], side: PinLeadProps["side"]) => (
    <div className="pinout-col">
      {pins.map((pin) => (
        <PinLead key={pin.number} pin={pin} side={side} isActive={active === pin.number} setActive={setActive} />
      ))}
    </div>
  );
  return (
    <figure
      className="panel pinout"
      aria-label={IDLE_READOUT}
      style={LAYOUT_VARS}
      data-open={active === null ? undefined : ""}
      onPointerMove={tilt}
      onPointerLeave={untilt}
    >
      <div className="pinout-sway">
        <div className="pinout-grid">
          {column(left, "left")}
          <span className="package-shadow" aria-hidden="true" />
          <PackageInside left={left} right={right} active={active} />
          <PackageBody left={left} right={right} active={active} />
          {column(right, "right")}
        </div>
      </div>
      <Readout active={active} />
    </figure>
  );
}
