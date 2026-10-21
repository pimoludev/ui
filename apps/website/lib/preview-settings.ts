import type { PimoluDensity, PimoluRadius, PimoluStylePreset } from "@pimolu/react";
import options from "../content/generated/preview-options.json" with { type: "json" };

export const previewOptions = options;
export interface PreviewSettings {
  preset: PimoluStylePreset | "inherit";
  mode: "inherit" | "light" | "dark";
  radius: PimoluRadius | "inherit";
  density: PimoluDensity | "inherit";
  brand: string;
  width: "full" | "768" | "390";
  direction: "ltr" | "rtl";
}
export const defaultPreviewSettings: PreviewSettings = { preset: "inherit", mode: "inherit", radius: "inherit", density: "inherit", brand: "", width: "full", direction: "ltr" };

export function parsePreviewSettings(params: Record<string, string | string[] | undefined> | URLSearchParams): PreviewSettings {
  const get = (name: string) => { const value = params instanceof URLSearchParams ? params.get(name) : params[name]; return typeof value === "string" ? value : ""; };
  const pick = <T extends string>(value: string, allowed: readonly string[], fallback: T): T => allowed.includes(value) ? value as T : fallback;
  return {
    preset: pick(get("preset"), options.presets, "inherit") as PreviewSettings["preset"],
    mode: pick(get("mode"), ["light", "dark"], "inherit") as PreviewSettings["mode"],
    radius: pick(get("radius"), options.radii, "inherit") as PreviewSettings["radius"],
    density: pick(get("density"), options.densities, "inherit") as PreviewSettings["density"],
    brand: /^#[0-9a-f]{6}$/i.test(get("brand")) ? get("brand").toLowerCase() : "",
    width: pick(get("width"), ["768", "390"], "full") as PreviewSettings["width"],
    direction: get("direction") === "rtl" ? "rtl" : "ltr",
  };
}

export function previewQuery(settings: PreviewSettings): string {
  const query = new URLSearchParams();
  for (const key of Object.keys(defaultPreviewSettings) as (keyof PreviewSettings)[]) if (settings[key] !== defaultPreviewSettings[key]) query.set(key, settings[key]);
  return query.toString();
}

export function customizeExample(source: string, example: string, settings: PreviewSettings): string {
  const props = [settings.mode !== "inherit" && `theme="${settings.mode}"`, settings.preset !== "inherit" && `stylePreset="${settings.preset}"`, settings.radius !== "inherit" && `radius="${settings.radius}"`, settings.density !== "inherit" && `density="${settings.density}"`, settings.brand && `brandColor="${settings.brand}"`].filter(Boolean).join(" ");
  if (!props && settings.direction === "ltr") return source;
  const providerImport = /import\s*\{[^}]*\bPimoluProvider\b[^}]*\}\s*from\s*["\']@pimolu\/react["\']/.test(source) ? "" : 'import { PimoluProvider } from "@pimolu/react";\n';
  const body = source.replace(/^"use client";\s*/, "");
  const content = `<PimoluProvider${props ? ` ${props}` : ""}>\n        <${example} />\n      </PimoluProvider>`;
  return `"use client";\n\n${providerImport}${body}\nexport function Customized${example}() {\n  return (\n    <div dir="${settings.direction}">\n      ${content}\n    </div>\n  );\n}\n`;
}
