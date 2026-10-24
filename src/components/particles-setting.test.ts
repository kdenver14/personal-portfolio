import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Setting = typeof import("./particles-setting");

function memoryStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
    items,
  };
}

const blockedStorage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
  removeItem: () => {
    throw new Error("blocked");
  },
};

/** A fresh copy of the module, so its remembered choice starts unread. */
async function load(localStorage: object): Promise<Setting> {
  vi.stubGlobal("window", { localStorage });
  return import("./particles-setting");
}

describe("particles setting", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts on when nothing is saved", async () => {
    const setting = await load(memoryStorage());
    expect(setting.particlesEnabled()).toBe(true);
  });

  it("starts off when the visitor turned them off before", async () => {
    const setting = await load(memoryStorage({ particles: "off" }));
    expect(setting.particlesEnabled()).toBe(false);
  });

  it("saves off and clears the entry when turned back on", async () => {
    const storage = memoryStorage();
    const setting = await load(storage);
    setting.setParticlesEnabled(false);
    expect(storage.items.get("particles")).toBe("off");
    setting.setParticlesEnabled(true);
    expect(storage.items.has("particles")).toBe(false);
    expect(setting.particlesEnabled()).toBe(true);
  });

  it("still toggles for this visit when storage is blocked", async () => {
    const setting = await load(blockedStorage);
    expect(setting.particlesEnabled()).toBe(true);
    setting.setParticlesEnabled(false);
    expect(setting.particlesEnabled()).toBe(false);
  });
});
