/**
 * Layout of the DIP-8 figure, in rem. The CSS reads it through custom properties set on the figure, and the
 * die and bond wires inside the package are drawn from it, so the wires land on the legs at any zoom.
 */
export const CHIP = {
  /** Package width. */
  width: 7.5,
  /** Space above the first pin row and below the last. */
  inset: 1.1,
  /** Height of one pin row; each leg sits at a row's centre. */
  row: 3.5,
  pinsPerSide: 4,
  /** Height of the package's sides, from the board to the lid. */
  depth: 1,
  die: { width: 2.75, height: 4.4 },
  /** Lead-frame finger reaching in from each leg, and the bond pad it is wired to. */
  finger: { length: 1.1, height: 0.5 },
  pad: 0.375,
} as const;

/** SVG units per rem, so strokes are drawn at the default size of a CSS pixel. */
export const UNITS_PER_REM = 16;
/** How far the middle of a bond wire arches above the straight line between its ends. */
const WIRE_ARCH = 1.1;
/** Gap between the die's edge and the centre of its bond pads. */
const PAD_EDGE = 0.3;

export type Side = "left" | "right";

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface BondWire {
  /** The wire, in SVG units. */
  readonly path: string;
  /** The bond pad on the die and the lead-frame finger, in rem from the package's top-left corner. */
  readonly pad: Rect;
  readonly finger: Rect;
}

export const packageHeight = (): number => CHIP.inset * 2 + CHIP.row * CHIP.pinsPerSide;

/** Centre of pin row `index`, 0 at the top, from the package's top edge. */
export const legY = (index: number): number => CHIP.inset + CHIP.row * (index + 0.5);

/** The die, centred in the package. */
export function dieRect(): Rect {
  const { width, height } = CHIP.die;
  return { x: (CHIP.width - width) / 2, y: (packageHeight() - height) / 2, width, height };
}

const fixed = (rem: number) => (rem * UNITS_PER_REM).toFixed(1);

/** The wire from bond pad `index` on one side of the die to the finger of the leg in the same row. */
export function bondWire(side: Side, index: number): BondWire {
  const die = dieRect();
  const padY = die.y + PAD_EDGE + (index * (die.height - 2 * PAD_EDGE)) / (CHIP.pinsPerSide - 1);
  const padX = side === "left" ? die.x + PAD_EDGE : die.x + die.width - PAD_EDGE;
  const y = legY(index);
  const tipX = side === "left" ? CHIP.finger.length : CHIP.width - CHIP.finger.length;
  const midX = (padX + tipX) / 2;
  const path = `M${fixed(padX)} ${fixed(padY)} C${fixed(midX)} ${fixed(padY - WIRE_ARCH)} ${fixed(midX)} ${fixed(y - WIRE_ARCH)} ${fixed(tipX)} ${fixed(y)}`;
  const half = CHIP.pad / 2;
  return {
    path,
    pad: { x: padX - half, y: padY - half, width: CHIP.pad, height: CHIP.pad },
    finger: {
      x: side === "left" ? 0 : CHIP.width - CHIP.finger.length,
      y: y - CHIP.finger.height / 2,
      width: CHIP.finger.length,
      height: CHIP.finger.height,
    },
  };
}
