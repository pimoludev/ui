import {
  buttonVariantMap,
  inputVariantMap,
  type PimoluStylePreset,
  type PimoluTheme,
  type PimoluThemeMode,
} from "@pimolu/react";

import { pimoluPresets } from "@pimolu/themes/presets";

/* Discovered from the theme package, so a new preset can never be forgotten. */
export const presets: PimoluStylePreset[] = [
  "default",
  ...(Object.keys(pimoluPresets) as PimoluStylePreset[]),
];

/* Color themes are not exposed as runtime data yet, so this stays explicit. */
export const themes: PimoluTheme[] = ["light", "dark"];

export const themeModes: PimoluThemeMode[] = ["light", "dark", "system"];

/* Derived from each component's own variant map, never duplicated here. */
export function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

export const buttonVariants = optionsOf(buttonVariantMap.variant);
export const buttonAppearances = optionsOf(buttonVariantMap.appearance);
export const buttonSizes = optionsOf(buttonVariantMap.size);
export const buttonRadii = optionsOf(buttonVariantMap.radius);

export const inputSizes = optionsOf(inputVariantMap.size);
export const inputVariants = optionsOf(inputVariantMap.variant);
export const inputAppearances = optionsOf(inputVariantMap.appearance);
