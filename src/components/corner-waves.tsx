import { waveLines } from "@/lib/waves";

const SIZE = 600;
const ROTATION_DEG = -32;
const ART_ID = "corner-waves-art";

// Lines near 40% of the stack pass through the page corner after rotation, so the stroke peaks there.
const LINES = waveLines({
  size: SIZE,
  lines: 52,
  step: 12,
  wavelength: 150,
  minAmplitude: 9,
  maxAmplitude: 22,
  phaseStep: 0.14,
  maxStroke: 4.2,
  minStroke: 0.6,
  thickAt: 0.38,
  thinAt: 0.85,
});

/** Op-art wavy lines in the top-right and bottom-left corners of the page. Decorative only. */
export function CornerWaves() {
  const view = `0 0 ${SIZE} ${SIZE}`;
  return (
    <div aria-hidden="true">
      <svg className="corner-defs" width="0" height="0">
        <defs>
          <g id={ART_ID} transform={`rotate(${ROTATION_DEG} ${SIZE / 2} ${SIZE / 2})`} fill="none" stroke="currentColor" strokeLinecap="round">
            {LINES.map((line, i) => <path key={i} d={line.d} strokeWidth={line.strokeWidth} />)}
          </g>
        </defs>
      </svg>
      <svg className="corner corner-tr" viewBox={view} preserveAspectRatio="xMaxYMin slice">
        <use href={`#${ART_ID}`} />
      </svg>
      <svg className="corner corner-bl" viewBox={view} preserveAspectRatio="xMaxYMin slice">
        <use href={`#${ART_ID}`} />
      </svg>
    </div>
  );
}
