import type { PluginThemeContribution } from "@getpaseo/plugin";

export type EngineId = "aurora" | "orbital" | "moss" | "blackhole" | "prism";

export interface ZayneThemeSpec {
  readonly contribution: PluginThemeContribution;
  readonly engine: EngineId;
  readonly tagline: string;
  readonly secondary: string;
}

export const ZAYNE_THEMES: readonly ZayneThemeSpec[] = [
  {
    engine: "aurora",
    tagline: "Deep midnight aurora waves with terracotta embers",
    secondary: "#38bdf8",
    contribution: {
      id: "zaynetheme",
      name: "Zayne Cyber Aurora",
      appearance: "dark",
      colors: {
        background: "#06060f",
        foreground: "#f5f5f7",
        raised: "#0e0d16",
        control: "#1a1828",
        border: "#27243b",
        accent: "#d97757",
        mutedForeground: "#9fa0a0",
        ring: "#38bdf8",
      },
    },
  },
  {
    engine: "orbital",
    tagline: "Smoked obsidian gold with intersecting macro astrolabe orbits",
    secondary: "#d97757",
    contribution: {
      id: "zaynetheme-obsidian-gold",
      name: "Zayne Obsidian Gold",
      appearance: "dark",
      colors: {
        background: "#07060a",
        foreground: "#f4f1ea",
        raised: "#110f15",
        control: "#1b1822",
        border: "#2c2635",
        accent: "#e5a95c",
        mutedForeground: "#9c948b",
        ring: "#d97757",
      },
    },
  },
  {
    engine: "moss",
    tagline: "Pine-ink twilight with moonlight shafts and firefly pond ripples",
    secondary: "#d97757",
    contribution: {
      id: "zaynetheme-moss-dusk",
      name: "Zayne Moss Dusk",
      appearance: "dark",
      colors: {
        background: "#040a09",
        foreground: "#eaf2ef",
        raised: "#0b1614",
        control: "#132421",
        border: "#203833",
        accent: "#5eead4",
        mutedForeground: "#8aa39d",
        ring: "#d97757",
      },
    },
  },
  {
    engine: "blackhole",
    tagline: "Monochrome silver singularity with gravitational lensing accretion",
    secondary: "#94a3b8",
    contribution: {
      id: "zaynetheme-silver-singularity",
      name: "Zayne Silver Singularity",
      appearance: "dark",
      colors: {
        background: "#050508",
        foreground: "#f3f4f6",
        raised: "#0d0e13",
        control: "#171922",
        border: "#272a36",
        accent: "#e5e7eb",
        mutedForeground: "#94a3b8",
        ring: "#cbd5e1",
      },
    },
  },
  {
    engine: "prism",
    tagline: "Midnight indigo astral prism with interactive crystal lattice",
    secondary: "#a78bfa",
    contribution: {
      id: "zaynetheme-astral-prism",
      name: "Zayne Astral Prism",
      appearance: "dark",
      colors: {
        background: "#040811",
        foreground: "#ebf3fc",
        raised: "#0a1322",
        control: "#122038",
        border: "#1f3354",
        accent: "#22d3ee",
        mutedForeground: "#8fa6c4",
        ring: "#a78bfa",
      },
    },
  },
];

export const ENGINE_LABELS: Readonly<Record<EngineId, string>> = {
  aurora: "Cyber Aurora",
  orbital: "Obsidian Gold Orbits",
  moss: "Moss Dusk Fireflies",
  blackhole: "Silver Singularity",
  prism: "Astral Prism Lattice",
};
