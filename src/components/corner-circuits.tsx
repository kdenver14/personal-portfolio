import type { CSSProperties } from "react";
import { routeTrace, type Point } from "@/lib/traces";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const SIZE = 480;
const PAD_RADIUS = 6;
/** The pulse dash pattern is measured against this normalised length, so every trace shares one pattern. */
const PATH_LENGTH = 100;
const CORNERS = ["tl", "tr", "bl", "br"] as const;

/** Loops run 4s, 5.3s or 6.6s in turn, and each trace starts 1.7s further in, so the pulses never march in step. */
const PULSE_SECONDS = 4;
const PULSE_STEP_SECONDS = 1.3;
const PULSE_VARIANTS = 3;
const STAGGER_SECONDS = 1.7;

/** Routed in from the top and left edges of the top-left corner; the other corners mirror it. No two traces cross. */
const ROUTES: readonly (readonly Point[])[] = [
  [[56, 0], [56, 12], [80, 36], [200, 36]],
  [[112, 0], [112, 8], [124, 20], [264, 20]],
  [[0, 56], [92, 56], [124, 88], [232, 88]],
  [[0, 80], [76, 80], [108, 112], [108, 200]],
  [[0, 108], [56, 108], [88, 140], [88, 236]],
  [[0, 136], [36, 136], [68, 168], [68, 272]],
  [[0, 212], [20, 212], [40, 232], [40, 336]],
];

const TRACES = ROUTES.map((route, i) => {
  const timing: CSSVars = {
    "--pulse": `${(PULSE_SECONDS + (i % PULSE_VARIANTS) * PULSE_STEP_SECONDS).toFixed(1)}s`,
    "--delay": `${(-i * STAGGER_SECONDS).toFixed(1)}s`,
  };
  return { ...routeTrace(route), timing };
});

function CircuitArt() {
  return (
    <svg className="circuit" viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {TRACES.map(({ d, end, timing }) => (
        <g key={d} style={timing}>
          <path className="trace" d={d} />
          <path className="trace-pulse" d={d} pathLength={PATH_LENGTH} />
          <circle className="trace-pad" cx={end[0]} cy={end[1]} r={PAD_RADIUS} />
        </g>
      ))}
    </svg>
  );
}

/** Circuit traces in all four page corners, each with a signal pulse that runs in and lights its pad. Decorative only. */
export function CornerCircuits() {
  return (
    <div aria-hidden="true">
      {CORNERS.map((corner) => (
        <div key={corner} className={`corner corner-${corner}`}>
          <CircuitArt />
        </div>
      ))}
    </div>
  );
}
