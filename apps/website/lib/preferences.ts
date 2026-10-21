import { pimoluPresets } from "@pimolu/themes/presets";
import type { PimoluStylePreset, PimoluThemeMode } from "@pimolu/react";

export const themeCookie = "pimolu-website-theme";
export const presetCookie = "pimolu-website-preset";
export const presetNames = ["default", ...Object.keys(pimoluPresets)] as PimoluStylePreset[];

export function parseTheme(value?: string): PimoluThemeMode {
  return value === "light" || value === "dark" ? value : "system";
}

export function parsePreset(value?: string): PimoluStylePreset {
  return presetNames.includes(value as PimoluStylePreset)
    ? (value as PimoluStylePreset)
    : "default";
}

export function preferenceCookie(name: string, value: string, secure: boolean) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${secure ? "; Secure" : ""}`;
}
