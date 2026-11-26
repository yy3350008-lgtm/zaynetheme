import type { PluginClientContext } from "@getpaseo/plugin/client";
import { installCosmosEngine } from "./client/cosmos-engine";
import { cycleCosmosMode } from "./client/preferences";
import { ZayneThemeSettingsPage } from "./client/settings-page";
import { ZAYNE_THEMES } from "./client/themes";

export default function contribute(client: PluginClientContext) {
  const removeThemes = ZAYNE_THEMES.map((spec) => client.addTheme(spec.contribution));
  const removeCosmos = installCosmosEngine();

  const removeSettings = client.addSettingsScreen({
    id: "cosmos",
    title: "ZayneTheme Cosmos",
    icon: "Sparkles",
    Component: ZayneThemeSettingsPage,
  });

  const removeCycleCommand = client.addCommandCenterItem({
    id: "cycle-cosmos-scene",
    context: "global",
    title: "ZayneTheme: Cycle Living Cosmos Scene",
    icon: "Sparkles",
    keywords: ["theme", "cosmos", "aurora", "blackhole", "orbital", "moss", "prism", "zayne"],
    onSelect() {
      cycleCosmosMode();
    },
  });

  const removeSettingsCommand = client.addCommandCenterItem({
    id: "open-cosmos-settings",
    context: "global",
    title: "ZayneTheme: Configure Living Cosmos",
    icon: "Palette",
    keywords: ["theme", "cosmos", "settings", "zayne", "appearance"],
    onSelect(ctx) {
      ctx.openSettings("cosmos");
    },
  });

  return () => {
    removeSettingsCommand();
    removeCycleCommand();
    removeSettings();
    removeCosmos();
    for (const removeTheme of removeThemes) {
      removeTheme();
    }
  };
}
