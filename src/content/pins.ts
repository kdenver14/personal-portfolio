import type { Pin, PinSignal } from "@/domain/datasheet";
import { EMAIL, EMAIL_URL, GITHUB_LABEL, GITHUB_URL, LOCATION, LOCATION_SHORT, OWNER } from "./profile";

/** DIP-8, numbered counter-clockwise from the notch: 1–4 down the left, 5–8 up the right. */
export const PINS: readonly Pin[] = [
  { number: 1, name: "GND", description: `Home. ${LOCATION}.` },
  { number: 2, name: "CPP", description: "C++. First language. Ask about move semantics and pointer ownership." },
  { number: 3, name: "TS", description: "TypeScript. Daily driver: Next.js, Express 5, Prisma." },
  { number: 4, name: "PY", description: "Python. MediaPipe, Keras, scripting and automation." },
  { number: 5, name: "CS", description: "C#. ASP.NET Core minimal APIs with EF Core." },
  { number: 6, name: "CLK", description: "Local time in Antipolo, Philippine Time (UTC+8)." },
  { number: 7, name: "GH", description: GITHUB_LABEL, href: GITHUB_URL },
  { number: 8, name: "MAIL", description: EMAIL, href: EMAIL_URL },
];

export const PIN_SUBLABELS: Readonly<Record<string, string>> = {
  GND: LOCATION_SHORT,
  CPP: "C++",
  TS: "TypeScript",
  PY: "Python",
  CS: "C#",
  GH: "GitHub",
  MAIL: "Email",
};

/** Each pin's lane on the logic analyzer under the chip. */
export const PIN_SIGNALS: Readonly<Record<string, PinSignal>> = {
  GND: { kind: "ground" },
  CPP: { kind: "uart", text: "C++" },
  TS: { kind: "uart", text: "TS" },
  PY: { kind: "uart", text: "PY" },
  CS: { kind: "uart", text: "C#" },
  CLK: { kind: "clock" },
  GH: { kind: "uart", text: OWNER },
  MAIL: { kind: "uart", text: "hi!" },
};
