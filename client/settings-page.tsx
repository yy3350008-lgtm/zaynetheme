import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PluginSurfaceProps } from "@getpaseo/plugin/client";
import {
  ScrollView,
  SettingsAction,
  SettingsCard,
  SettingsRow,
  SettingsSection,
  SettingsSelect,
  SettingsSwitch,
  useToast,
} from "@getpaseo/plugin/client/ui";
import {
  resetCosmosPreferences,
  updateCosmosPreferences,
  useCosmosPreferences,
  type CosmosIntensity,
  type CosmosMode,
} from "./preferences";
import { ZAYNE_THEMES } from "./themes";

const MODE_OPTIONS: ReadonlyArray<{ label: string; value: CosmosMode }> = [
  { label: "Auto (match active Zayne theme)", value: "auto" },
  { label: "Obsidian Gold Orbits", value: "orbital" },
  { label: "Moss Dusk Fireflies", value: "moss" },
  { label: "Silver Singularity (WebGL)", value: "blackhole" },
  { label: "Astral Prism Lattice", value: "prism" },
  { label: "Cyber Aurora Wave", value: "aurora" },
  { label: "Off (static palette only)", value: "off" },
];

const INTENSITY_OPTIONS: ReadonlyArray<{ label: string; value: CosmosIntensity }> = [
  { label: "Subtle", value: "subtle" },
  { label: "Balanced", value: "balanced" },
  { label: "Immersive", value: "immersive" },
];

export function ZayneThemeSettingsPage({ theme, layout }: PluginSurfaceProps) {
  const prefs = useCosmosPreferences();
  const toast = useToast();
  const isWeb = layout.platform === "web";

  const handleReset = () => {
    resetCosmosPreferences();
    toast.show("Reset ZayneTheme Living Cosmos settings to defaults.", { variant: "info" });
  };

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: theme.colors.surface0 }]}
      contentContainerStyle={[
        styles.container,
        { padding: layout.compact ? 16 : 24 },
      ]}
    >
      <SettingsSection title="Living Cosmos Engine">
        <SettingsCard>
          {!isWeb && (
            <SettingsRow
              label="Mobile palette mode"
              hint="Color palettes apply natively on iOS and Android. WebGL and Canvas ambient scenes run on Desktop and Web."
            />
          )}
          <SettingsSelect
            label="Scene mode"
            hint="Automatically follows your active Zayne theme or pins a dedicated scene across Paseo."
            value={prefs.mode}
            options={MODE_OPTIONS}
            onValueChange={(mode) => updateCosmosPreferences({ mode })}
          />
          <SettingsSelect
            label="Ambient intensity"
            hint="Controls backdrop luminosity behind chat timelines and panels."
            value={prefs.intensity}
            options={INTENSITY_OPTIONS}
            onValueChange={(intensity) => updateCosmosPreferences({ intensity })}
          />
          <SettingsSwitch
            label="Pointer interaction and ripples"
            hint="Allows mouse or touch movement to nudge particles, fireflies, and prism cells."
            value={prefs.interactive}
            onValueChange={(interactive) => updateCosmosPreferences({ interactive })}
          />
          <SettingsSwitch
            label="Respect reduced motion"
            hint="Optional: pause canvas rendering when OS reduced-motion is enabled (off by default so Windows performance settings do not hide scenes)."
            value={prefs.respectReducedMotion}
            onValueChange={(respectReducedMotion) =>
              updateCosmosPreferences({ respectReducedMotion })
            }
          />
          <SettingsAction
            label="Reset cosmos settings"
            hint="Restores Auto scene matching, Balanced intensity, and interactive ripples."
            actionLabel="Reset defaults"
            onPress={handleReset}
          />
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Theme Collection">
        <SettingsCard>
          <SettingsRow
            label="Switch active theme"
            hint="Open Settings -> Appearance to choose any of the five Zayne dark cosmic themes."
          />
          {ZAYNE_THEMES.map((spec, index) => {
            const { colors, name, id } = spec.contribution;
            const swatches = [
              colors.background,
              colors.raised,
              colors.control,
              colors.accent ?? colors.ring,
              colors.ring,
            ];
            return (
              <View
                key={id}
                style={[
                  styles.themeRow,
                  index > 0 && { borderTopWidth: 1, borderTopColor: theme.colors.border },
                ]}
              >
                <View style={styles.themeMeta}>
                  <Text style={[styles.themeName, { color: theme.colors.foreground }]}>
                    {name}
                  </Text>
                  <Text style={[styles.themeTagline, { color: theme.colors.foregroundMuted }]}>
                    {spec.tagline}
                  </Text>
                </View>
                <View style={styles.swatchRow}>
                  {swatches.map((hex, swatchIndex) => (
                    <View
                      key={`${id}-${swatchIndex}`}
                      style={[
                        styles.swatch,
                        { backgroundColor: hex, borderColor: theme.colors.border },
                      ]}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </SettingsCard>
      </SettingsSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    gap: 20,
    maxWidth: 760,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    flexWrap: "wrap",
  },
  themeMeta: {
    flex: 1,
    minWidth: 200,
    gap: 3,
  },
  themeName: {
    fontSize: 14,
    fontWeight: "600",
  },
  themeTagline: {
    fontSize: 12,
    lineHeight: 17,
  },
  swatchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});
