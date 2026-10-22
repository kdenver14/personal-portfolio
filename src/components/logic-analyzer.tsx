import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type { Pin, PinSignal } from "@/domain/datasheet";
import { PIN_SIGNALS, PINS } from "@/content/pins";
import { release } from "@/lib/pick";
import {
  BITS_PER_FRAME,
  type ByteSpan,
  type FlashStop,
  byteSpans,
  clockBits,
  flashStops,
  repeatToFill,
  uartBits,
  wavePath,
} from "@/lib/uart";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

/** Width of one bit and how long it takes to scroll by: 60px a second, so a 10-bit clock period lasts 1s. */
const BIT_PX = 6;
const BIT_MS = 100;
const CLOCK_HALF_BITS = 5;
/** A lane: the wave on top, the decoder's byte bubbles under it. */
const LANE_HEIGHT = 28;
const SCALE = { bit: BIT_PX, high: 3, low: 13 };
const BUBBLE = { top: 16, height: 11, inset: 1, radius: 3, baseline: 24.5 };
/** Waves are drawn at least this wide, wider than any lane gets. */
const MAX_LANE_PX = 480;
/** How many bits a pin's leg stays lit when a byte goes out, or the clock rises. */
const FLASH_BITS = 1.5;

interface Lane {
  readonly pin: Pin;
  readonly path: string;
  readonly width: number;
  /** The decoder's bubbles, across every drawn copy of the signal. */
  readonly bytes: readonly ByteSpan[];
  /** One repeat of the signal: the wave scrolls left by this much, then starts over seamlessly. */
  readonly cycle: number;
  readonly durationMs: number;
  readonly scrolls: boolean;
  /** When the pin's leg flashes in each cycle: as each byte, or each clock edge, leaves the lane's left edge. */
  readonly flashes: readonly FlashStop[];
  /** What the lane carries, shown while it is picked. */
  readonly decoded: string;
}

function bitsOf(signal: PinSignal): number[] {
  switch (signal.kind) {
    case "uart":
      return uartBits(signal.text);
    case "clock":
      return clockBits(CLOCK_HALF_BITS);
    case "ground":
      return [0];
  }
}

function decode(signal: PinSignal): string {
  switch (signal.kind) {
    case "uart":
      return `"${signal.text}"`;
    case "clock":
      return "1 Hz";
    case "ground":
      return "0 V";
  }
}

/** Bit indexes in one cycle where the pin's leg should flash. */
function flashBits(signal: PinSignal): number[] {
  switch (signal.kind) {
    case "uart":
      return [...signal.text].map((_, i) => i * BITS_PER_FRAME);
    case "clock":
      return [0];
    case "ground":
      return [];
  }
}

function laneOf(pin: Pin): Lane {
  const signal = PIN_SIGNALS[pin.name];
  if (!signal) {
    throw new Error(`Pin ${pin.name} has no signal for the logic analyzer`);
  }
  const bits = bitsOf(signal);
  const drawn = repeatToFill(bits, BIT_PX, MAX_LANE_PX);
  const copies = drawn.length / bits.length;
  const spans = signal.kind === "uart" ? byteSpans(signal.text) : [];
  return {
    pin,
    path: wavePath(drawn, SCALE),
    width: drawn.length * BIT_PX,
    bytes: Array.from({ length: copies }, (_, copy) =>
      spans.map((span) => ({ ...span, start: span.start + copy * bits.length, end: span.end + copy * bits.length })),
    ).flat(),
    cycle: bits.length * BIT_PX,
    durationMs: bits.length * BIT_MS,
    scrolls: signal.kind !== "ground",
    flashes: flashStops(flashBits(signal), bits.length, FLASH_BITS),
    decoded: decode(signal),
  };
}

const LANES = PINS.map(laneOf);

/**
 * Keyframes that light each pin's leg as its bytes go out. They run on the same clock as the waves, since
 * both start when the page first renders, so a leg flashes as each byte or clock edge leaves its lane's left
 * edge. Only with motion allowed, and never over a picked pin.
 */
function legFlashCss(lanes: readonly Lane[]): string {
  const rules = lanes
    .filter((lane) => lane.flashes.length > 0)
    .map((lane) => {
      const name = `tx-${lane.pin.number}`;
      const stops = lane.flashes.map(({ on, off }) => `${on}%{background:var(--color-blue);border-color:var(--color-blue)}${off}%{background:var(--leg);border-color:var(--leg-edge)}`);
      return (
        `@keyframes ${name}{0%{background:var(--leg);border-color:var(--leg-edge)}${stops.join("")}}` +
        `.pin[data-pin="${lane.pin.number}"]:not(.is-active) .pin-leg{animation:${name} ${lane.durationMs}ms steps(1,end) infinite}`
      );
    });
  return `@media (prefers-reduced-motion:no-preference){${rules.join("")}}`;
}

const LEG_FLASH_CSS = legFlashCss(LANES);

function Bubbles({ bytes }: { bytes: readonly ByteSpan[] }) {
  return bytes.map((byte) => {
    const x = byte.start * BIT_PX + BUBBLE.inset;
    const width = (byte.end - byte.start) * BIT_PX - 2 * BUBBLE.inset;
    return (
      <g key={byte.start} className="analyzer-byte">
        <rect x={x} y={BUBBLE.top} width={width} height={BUBBLE.height} rx={BUBBLE.radius} />
        <text x={x + width / 2} y={BUBBLE.baseline}>
          {byte.char}
        </text>
      </g>
    );
  });
}

interface LogicAnalyzerProps {
  active: number | null;
  setActive: Dispatch<SetStateAction<number | null>>;
}

/**
 * A lane per pin under the chip, scrolling like a logic analyzer: each pin sends its own name as UART bytes,
 * decoded in bubbles under the wave, CLK ticks at 1 Hz and GND sits at 0 V. Each pin's leg flashes as its
 * bytes go out. Hovering a lane picks its pin, as hovering the pin does. Decorative: the pins carry the same
 * information for assistive tech.
 */
export function LogicAnalyzer({ active, setActive }: LogicAnalyzerProps) {
  return (
    <div className="analyzer" aria-hidden="true">
      <style>{LEG_FLASH_CSS}</style>
      <div className={active === null ? "analyzer-lanes" : "analyzer-lanes has-active"}>
        {LANES.map((lane) => (
          <div
            key={lane.pin.number}
            className={active === lane.pin.number ? "analyzer-lane is-active" : "analyzer-lane"}
            onPointerEnter={() => setActive(lane.pin.number)}
            onPointerLeave={() => setActive(release(lane.pin.number))}
          >
            <span className="analyzer-name">{lane.pin.name}</span>
            <span className="analyzer-view">
              <svg
                className={lane.scrolls ? "analyzer-wave is-scrolling" : "analyzer-wave"}
                width={lane.width}
                height={LANE_HEIGHT}
                style={{ "--cycle": `${-lane.cycle}px`, animationDuration: `${lane.durationMs}ms` } as CSSVars}
              >
                <path d={lane.path} />
                <Bubbles bytes={lane.bytes} />
              </svg>
            </span>
            <span className="analyzer-decoded">{lane.decoded}</span>
          </div>
        ))}
      </div>
      <p className="analyzer-caption">Each pin sends its own name as UART bytes, decoded underneath. CLK ticks once a second.</p>
    </div>
  );
}
