/** Square-wave drawing for the chip's logic analyzer: UART frames and a clock, as bits and as SVG paths. */

const BITS_PER_BYTE = 8;
const IDLE = 1;
const START = 0;
const STOP = 1;

/** The line idles high for this many bits after each message, before it repeats. */
export const IDLE_BITS = 8;

/** `text` as 8N1 UART frames: a start bit, the byte least significant bit first, a stop bit; then idle. */
export function uartBits(text: string): number[] {
  const frames = [...text].flatMap((char) => {
    const code = char.charCodeAt(0);
    const data = Array.from({ length: BITS_PER_BYTE }, (_, bit) => (code >> bit) & 1);
    return [START, ...data, STOP];
  });
  return [...frames, ...Array<number>(IDLE_BITS).fill(IDLE)];
}

/** One clock period: high for `half` bits, then low for `half`. */
export function clockBits(half: number): number[] {
  return [...Array<number>(half).fill(1), ...Array<number>(half).fill(0)];
}

export interface WaveScale {
  /** Width of one bit. */
  readonly bit: number;
  /** y of a high bit and of a low bit. */
  readonly high: number;
  readonly low: number;
}

/** A square wave through `bits`, starting at x = 0. */
export function wavePath(bits: readonly number[], { bit, high, low }: WaveScale): string {
  const y = (value: number | undefined) => (value ? high : low);
  return bits.reduce((path, value, i) => `${path} V${y(value)} H${(i + 1) * bit}`, `M0 ${y(bits[0])}`);
}

/** `bits` repeated until they span at least `width`, plus one more cycle so a scroll of one cycle never shows the end. */
export function repeatToFill(bits: readonly number[], bit: number, width: number): number[] {
  const cycle = bits.length * bit;
  const copies = Math.ceil(width / cycle) + 1;
  return Array.from({ length: copies }, () => bits).flat();
}
