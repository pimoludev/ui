import { pimoluPresets } from "@pimolu/themes/presets";
import themes from "@pimolu/themes/themes.json" with { type: "json" };
import type { PimoluStylePreset } from "@pimolu/react";

export const presetDescriptions: Record<PimoluStylePreset, string> = {
  default: "Balanced and versatile",
  adaptive: "Indigo with a teal accent",
  monochrome: "A study in neutrals",
  cartoon: "Playful, confident contrast",
  glass: "Light and translucent",
  luxury: "Warm, quiet refinement",
  "neo-brutalism": "Bold lines, vivid character",
};

export function paletteFor(preset: PimoluStylePreset, mode: "light" | "dark"): Record<string, string> {
  // Match the CSS cascade: presets override the base semantic theme and may
  // leave status colors inherited. Preset JSON keys use camelCase.
  const overrides = preset === "default" ? {} : Object.fromEntries(
    Object.entries(pimoluPresets[preset][mode]).map(([key, value]) => [key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), value]),
  );
  return { ...themes[mode], ...overrides };
}

export const paletteTokens = ["background", "surface", "primary", "foreground", "border", "success", "warning", "danger"] as const;
