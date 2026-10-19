import type { CSSProperties } from "react";
import { squiggleArc, type SquiggleOptions } from "@/lib/waves";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const SIZE = 480;
const STROKE_WIDTH = 6;
const CORNERS = ["tl", "tr", "bl", "br"] as const;

interface Ring extends SquiggleOptions {
  /** Share of the site blue mixed into the paper colour, in percent. */
  tint: number;
  /** Seconds to drift by one wave. */
  duration: number;
  /** 1 turns clockwise, -1 counter-clockwise. */
  direction: 1 | -1;
}

const RINGS: readonly Ring[] = [
  { radius: 170, wavelength: 80, amplitude: 6, tint: 30, duration: 12, direction: 1 },
  { radius: 262, wavelength: 80, amplitude: 6, tint: 20, duration: 16, direction: -1 },
  { radius: 354, wavelength: 80, amplitude: 6, tint: 13, duration: 20, direction: 1 },
];

/** Each loop turns a squiggle by exactly one of its waves, so the drift has no seam. */
const SQUIGGLES = RINGS.map((ring, i) => {
  const { d, lobes } = squiggleArc(ring);
  const style: CSSVars = {
    "--tint": `${ring.tint}%`,
    "--drift": `${ring.duration}s`,
    "--turn": `${((ring.direction * 360) / lobes).toFixed(4)}deg`,
  };
  return { id: `corner-squiggle-${i}`, d, style };
});

/** Three blue squiggles drifting around all four page corners. Decorative only. */
export function CornerWaves() {
  return (
    <div aria-hidden="true">
      <svg className="corner-defs" width="0" height="0">
        <defs>
          {SQUIGGLES.map(({ id, d }) => (
            <path key={id} id={id} d={d} fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} />
          ))}
        </defs>
      </svg>
      {CORNERS.map((corner) => (
        <div key={corner} className={`corner corner-${corner}`}>
          {SQUIGGLES.map(({ id, style }) => (
            <svg key={id} className="squiggle" viewBox={`0 0 ${SIZE} ${SIZE}`} style={style}>
              <use href={`#${id}`} />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}
