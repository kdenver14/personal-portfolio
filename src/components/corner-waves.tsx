import type { CSSProperties } from "react";
import { waveLines, wavePeriod } from "@/lib/waves";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const SIZE = 600;
const ROTATION_DEG = -32;
const WAVELENGTH = 150;
const ART_ID = "corner-waves-art";
const CORNERS = ["tl", "tr", "bl", "br"] as const;
/** How far the swell rocks the art across the lines, as a share of the corner. */
const BOB_SHARE = 0.015;

const PERIOD = wavePeriod(WAVELENGTH);

// Lines near 38% of the stack pass through the page corner after rotation, so the stroke peaks there.
const LINES = waveLines({
  size: SIZE,
  lines: 52,
  step: 14,
  wavelength: WAVELENGTH,
  minAmplitude: 9,
  maxAmplitude: 22,
  phaseStep: 0.14,
  maxStroke: 4.2,
  minStroke: 0.6,
  thickAt: 0.38,
  thinAt: 0.85,
  extend: PERIOD,
});

const percent = (n: number): string => `${(n * 100).toFixed(2)}%`;

/** One wave period along the rotated lines, as a share of the corner: the distance the drift slides per loop. */
function driftVars(): CSSVars {
  const angle = (ROTATION_DEG * Math.PI) / 180;
  const share = PERIOD / SIZE;
  return { "--drift-x": percent(-share * Math.cos(angle)), "--drift-y": percent(-share * Math.sin(angle)) };
}

/** A small rock across the lines, perpendicular to the drift. */
function bobVars(): CSSVars {
  const angle = (ROTATION_DEG * Math.PI) / 180;
  return { "--bob-x": percent(-BOB_SHARE * Math.sin(angle)), "--bob-y": percent(BOB_SHARE * Math.cos(angle)) };
}

const DRIFT = driftVars();
const BOB = bobVars();

/** Op-art wavy lines drifting in all four page corners like an ocean swell. Decorative only. */
export function CornerWaves() {
  return (
    <div aria-hidden="true">
      <svg className="corner-defs" width="0" height="0">
        <defs>
          <g id={ART_ID} transform={`rotate(${ROTATION_DEG} ${SIZE / 2} ${SIZE / 2})`} fill="none" stroke="currentColor" strokeLinecap="round">
            {LINES.map((line, i) => <path key={i} d={line.d} strokeWidth={line.strokeWidth} />)}
          </g>
        </defs>
      </svg>
      {CORNERS.map((corner) => (
        <div key={corner} className={`corner corner-${corner}`}>
          <div className="corner-bob" style={BOB}>
            <svg className="corner-art" viewBox={`0 0 ${SIZE} ${SIZE}`} style={DRIFT}>
              <use href={`#${ART_ID}`} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
