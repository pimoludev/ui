import { createVariants } from "@pimolu/core";

export const footerVariantMap = {
  appearance: {
    surface: "pimolu-footer--surface",
    transparent: "pimolu-footer--transparent",
    floating: "pimolu-footer--floating",
  },
} as const;

export type PimoluFooterAppearance = keyof typeof footerVariantMap.appearance;
export const footerVariants = createVariants({ base: "pimolu-footer", variants: footerVariantMap, defaultVariants: { appearance: "surface" } });
