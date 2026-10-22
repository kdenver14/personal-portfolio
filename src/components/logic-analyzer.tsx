import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type { Pin, PinSignal } from "@/domain/datasheet";
import { PIN_SIGNALS, PINS } from "@/content/pins";
import { release } from "@/lib/pick";
import { clockBits, repeatToFill, uartBits, wavePath } from "@/lib/uart";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

/** Width of one bit and how long it takes to scroll by: 60px a second, so a 10-bit clock period lasts 1s. */
const BIT_PX = 6;
const BIT_MS = 100;
const CLOCK_HALF_BITS = 5;
const LANE_HEIGHT = 18;
const LEVEL_INSET = 3;
/** Waves are drawn at least this wide, wider than any lane gets. */
const MAX_LANE_PX = 480;
const SCALE = { bit: BIT_PX, high: LEVEL_INSET, low: LANE_HEIGHT - LEVEL_INSET };

interface Lane {
  readonly pin: Pin;
  readonly path: string;
  readonly width: number;
  /** One repeat of the signal: the wave scrolls left by this much, then starts over seamlessly. */
  readonly cycle: number;
  readonly durationMs: number;
  readonly scrolls: boolean;
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

function laneOf(pin: Pin): Lane {
  const signal = PIN_SIGNALS[pin.name];
  if (!signal) {
    throw new Error(`Pin ${pin.name} has no signal for the logic analyzer`);
  }
  const bits = bitsOf(signal);
  const drawn = repeatToFill(bits, BIT_PX, MAX_LANE_PX);
  return {
    pin,
    path: wavePath(drawn, SCALE),
    width: drawn.length * BIT_PX,
    cycle: bits.length * BIT_PX,
    durationMs: bits.length * BIT_MS,
    scrolls: signal.kind !== "ground",
    decoded: decode(signal),
  };
}

const LANES = PINS.map(laneOf);

interface LogicAnalyzerProps {
  active: number | null;
  setActive: Dispatch<SetStateAction<number | null>>;
}

/**
 * A lane per pin under the chip, scrolling like a logic analyzer: each pin sends its own name as UART bytes,
 * CLK ticks at 1 Hz and GND sits at 0 V. Hovering a lane picks its pin, as hovering the pin does.
 * Decorative: the pins carry the same information for assistive tech.
 */
export function LogicAnalyzer({ active, setActive }: LogicAnalyzerProps) {
  return (
    <div className="analyzer" aria-hidden="true">
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
              </svg>
            </span>
            <span className="analyzer-decoded">{lane.decoded}</span>
          </div>
        ))}
      </div>
      <p className="analyzer-caption">Each pin sends its own name as UART bytes. CLK ticks once a second.</p>
    </div>
  );
}
