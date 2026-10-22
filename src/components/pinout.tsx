"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import type { Pin } from "@/domain/datasheet";
import { PIN_SUBLABELS, PINS } from "@/content/pins";
import { PART_NUMBER } from "@/content/profile";
import { release } from "@/lib/pick";
import { LocalClock } from "./local-clock";
import { LogicAnalyzer } from "./logic-analyzer";

const PINS_PER_SIDE = 4;
const DATE_CODE = "2246 PH";
const IDLE_READOUT = "Me, as an 8-pin chip. Hover or tap a pin.";

type SetActive = Dispatch<SetStateAction<number | null>>;

function pinHandlers(pin: number, setActive: SetActive) {
  return {
    onMouseEnter: () => setActive(pin),
    onMouseLeave: () => setActive(release(pin)),
    onFocus: () => setActive(pin),
    onBlur: () => setActive(release(pin)),
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

function PackageBody({ left, right, active }: { left: readonly Pin[]; right: readonly Pin[]; active: number | null }) {
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

export function PinFigure() {
  const [active, setActive] = useState<number | null>(null);
  const left = PINS.slice(0, PINS_PER_SIDE);
  const right = PINS.slice(PINS_PER_SIDE).toReversed();
  const column = (pins: readonly Pin[], side: PinLeadProps["side"]) => (
    <div className="pinout-col">
      {pins.map((pin) => (
        <PinLead key={pin.number} pin={pin} side={side} isActive={active === pin.number} setActive={setActive} />
      ))}
    </div>
  );
  return (
    <figure className="panel pinout" aria-label={IDLE_READOUT}>
      <div className="pinout-grid">
        {column(left, "left")}
        <PackageBody left={left} right={right} active={active} />
        {column(right, "right")}
      </div>
      <LogicAnalyzer active={active} setActive={setActive} />
      <Readout active={active} />
    </figure>
  );
}
