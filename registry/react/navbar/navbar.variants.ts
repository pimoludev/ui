import { createVariants } from "@pimolu/core";

export const navbarVariantMap = {
  appearance: {
    surface: "pimolu-navbar--surface",
    transparent: "pimolu-navbar--transparent",
    floating: "pimolu-navbar--floating",
  },
} as const;

export type PimoluNavbarAppearance = keyof typeof navbarVariantMap.appearance;
export const navbarVariants = createVariants({ base: "pimolu-navbar", variants: navbarVariantMap, defaultVariants: { appearance: "surface" } });
