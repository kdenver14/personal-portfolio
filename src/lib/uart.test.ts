import { describe, expect, it } from "vitest";
import { BITS_PER_FRAME, IDLE_BITS, byteSpans, clockBits, flashStops, repeatToFill, uartBits, wavePath } from "./uart";

describe("uartBits", () => {
  it("frames each byte with a start bit, LSB-first data and a stop bit", () => {
    // "T" is 0x54, 0101 0100.
    expect(uartBits("T").slice(0, 10)).toEqual([0, 0, 0, 1, 0, 1, 0, 1, 0, 1]);
  });

  it("idles high after the message", () => {
    const bits = uartBits("TS");
    expect(bits).toHaveLength(2 * 10 + IDLE_BITS);
    expect(bits.slice(-IDLE_BITS).every((bit) => bit === 1)).toBe(true);
  });
});

describe("clockBits", () => {
  it("is high for half a period, then low", () => {
    expect(clockBits(2)).toEqual([1, 1, 0, 0]);
  });
});

describe("wavePath", () => {
  it("steps between the high and low levels one bit at a time", () => {
    expect(wavePath([1, 0], { bit: 6, high: 3, low: 15 })).toBe("M0 3 V3 H6 V15 H12");
  });
});

describe("repeatToFill", () => {
  it("repeats the bits past the width by one whole cycle", () => {
    expect(repeatToFill([1, 0], 6, 20)).toHaveLength(2 * 3);
  });
});

describe("byteSpans", () => {
  it("covers each character's eight data bits, between its start and stop bits", () => {
    expect(byteSpans("TS")).toEqual([
      { char: "T", start: 1, end: 9 },
      { char: "S", start: 1 + BITS_PER_FRAME, end: 9 + BITS_PER_FRAME },
    ]);
  });

  it("lands on the data bits uartBits sends", () => {
    const bits = uartBits("T");
    const [span] = byteSpans("T");
    expect(bits[(span?.start ?? 0) - 1]).toBe(0);
    expect(bits[span?.end ?? 0]).toBe(1);
  });
});

describe("flashStops", () => {
  it("places each flash as a share of the cycle", () => {
    expect(flashStops([0, 10], 40, 1)).toEqual([
      { on: 0, off: 2.5 },
      { on: 25, off: 27.5 },
    ]);
  });

  it("never runs a flash past the end of the cycle", () => {
    expect(flashStops([39], 40, 3)).toEqual([{ on: 97.5, off: 100 }]);
  });
});
