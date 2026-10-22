import { describe, expect, it } from "vitest";
import { PIN_SIGNALS, PINS } from "./pins";

describe("PIN_SIGNALS", () => {
  it("gives every pin a lane on the logic analyzer", () => {
    expect(PINS.filter((pin) => !PIN_SIGNALS[pin.name]).map((pin) => pin.name)).toEqual([]);
  });

  it("sends only ASCII, which an 8-bit UART frame can carry", () => {
    const texts = Object.values(PIN_SIGNALS).flatMap((signal) => (signal.kind === "uart" ? [signal.text] : []));
    expect(texts.filter((text) => [...text].some((char) => char.charCodeAt(0) > 0x7f))).toEqual([]);
  });
});
