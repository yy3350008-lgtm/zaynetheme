import { useSyncExternalStore } from "react";
import type { EngineId } from "./themes";

export type CosmosMode = "auto" | EngineId | "off";
export type CosmosIntensity = "subtle" | "balanced" | "immersive";

export interface ZayneThemePreferences {
  mode: CosmosMode;
  intensity: CosmosIntensity;
  interactive: boolean;
  respectReducedMotion: boolean;
}

export const COSMOS_MODE_ORDER: readonly CosmosMode[] = [
  "auto",
  "orbital",
  "moss",
  "blackhole",
  "prism",
  "aurora",
  "off",
];

const VALID_MODES = new Set<CosmosMode>(COSMOS_MODE_ORDER);
const VALID_INTENSITIES = new Set<CosmosIntensity>(["subtle", "balanced", "immersive"]);
const STORAGE_KEY = "paseo/zaynetheme/preferences/v1";

export const DEFAULT_COSMOS_PREFERENCES: Readonly<ZayneThemePreferences> = {
  mode: "auto",
  intensity: "balanced",
  interactive: true,
  respectReducedMotion: false,
};

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getStorage(): StorageLike | undefined {
  const host = globalThis as typeof globalThis & { localStorage?: StorageLike };
  return host.localStorage;
}

function loadPreferences(): ZayneThemePreferences {
  try {
    const raw = getStorage()?.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_COSMOS_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<ZayneThemePreferences>;
    return {
      mode:
        typeof parsed.mode === "string" && VALID_MODES.has(parsed.mode as CosmosMode)
          ? (parsed.mode as CosmosMode)
          : DEFAULT_COSMOS_PREFERENCES.mode,
      intensity:
        typeof parsed.intensity === "string" &&
        VALID_INTENSITIES.has(parsed.intensity as CosmosIntensity)
          ? (parsed.intensity as CosmosIntensity)
          : DEFAULT_COSMOS_PREFERENCES.intensity,
      interactive:
        typeof parsed.interactive === "boolean"
          ? parsed.interactive
          : DEFAULT_COSMOS_PREFERENCES.interactive,
      respectReducedMotion:
        typeof parsed.respectReducedMotion === "boolean"
          ? parsed.respectReducedMotion
          : DEFAULT_COSMOS_PREFERENCES.respectReducedMotion,
    };
  } catch {
    return { ...DEFAULT_COSMOS_PREFERENCES };
  }
}

let currentPreferences: ZayneThemePreferences = loadPreferences();
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function getCosmosPreferences(): ZayneThemePreferences {
  return currentPreferences;
}

export function updateCosmosPreferences(patch: Partial<ZayneThemePreferences>): void {
  currentPreferences = { ...currentPreferences, ...patch };
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify(currentPreferences));
  } catch {
    // Ignore storage quota/privacy failures; keep in-memory state active.
  }
  notify();
}

export function resetCosmosPreferences(): void {
  currentPreferences = { ...DEFAULT_COSMOS_PREFERENCES };
  try {
    getStorage()?.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
  notify();
}

export function cycleCosmosMode(): CosmosMode {
  const index = COSMOS_MODE_ORDER.indexOf(currentPreferences.mode);
  const next = COSMOS_MODE_ORDER[(index + 1) % COSMOS_MODE_ORDER.length] ?? "auto";
  updateCosmosPreferences({ mode: next });
  return next;
}

export function subscribeCosmosPreferences(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCosmosPreferences(): ZayneThemePreferences {
  return useSyncExternalStore(
    subscribeCosmosPreferences,
    getCosmosPreferences,
    getCosmosPreferences,
  );
}
