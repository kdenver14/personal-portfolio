import type { CSSProperties } from "react";
import { rippleTurn, waveRings, type RingOptions } from "@/lib/waves";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const SIZE = 600;
const ART_ID = "corner-waves-art";
const CORNERS = ["tl", "tr", "bl", "br"] as const;

const RINGS: RingOptions = {
  innerRadius: 24,
  outerRadius: 920,
  growth: 1.09,
  lobes: 40,
  amplitude: 0.035,
  phaseStep: 0.35,
  strokeRatio: 0.0055,
  step: 9,
};

const LINES = waveRings(RINGS);

/** One loop scales the rings by exactly one ring step and turns them to match, so the ripple has no seam. */
const RIPPLE: CSSVars = {
  "--ripple-scale": String(RINGS.growth),
  "--ripple-turn": `${rippleTurn(RINGS).toFixed(4)}deg`,
};

/** Wavy concentric rings rippling out of all four page corners. Decorative only. */
export function CornerWaves() {
  return (
    <div aria-hidden="true">
      <svg className="corner-defs" width="0" height="0">
        <defs>
          <g id={ART_ID} fill="none" stroke="currentColor" strokeLinecap="round">
            {LINES.map((line, i) => <path key={i} d={line.d} strokeWidth={line.strokeWidth} />)}
          </g>
        </defs>
      </svg>
      {CORNERS.map((corner) => (
        <div key={corner} className={`corner corner-${corner}`}>
          <svg className="corner-art" viewBox={`0 0 ${SIZE} ${SIZE}`} style={RIPPLE}>
            <use href={`#${ART_ID}`} />
          </svg>
        </div>
      ))}
    </div>
  );
}
