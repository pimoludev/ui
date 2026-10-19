import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Separator axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const separatorVariantMap = {
  orientation: {
    horizontal: "pimolu-separator--horizontal",
    vertical: "pimolu-separator--vertical",
  },

  appearance: {
    solid: "pimolu-separator--solid",
    dashed: "pimolu-separator--dashed",
    dotted: "pimolu-separator--dotted",
  },

  thickness: {
    thin: "pimolu-separator--thin",
    medium: "pimolu-separator--medium",
    thick: "pimolu-separator--thick",
  },

  variant: {
    neutral: "pimolu-separator--neutral",
    primary: "pimolu-separator--primary",
    secondary: "pimolu-separator--secondary",
    success: "pimolu-separator--success",
    warning: "pimolu-separator--warning",
    danger: "pimolu-separator--danger",
  },
} as const;

export const separatorVariants = createVariants({
  base: "pimolu-separator",
  variants: separatorVariantMap,

  defaultVariants: {
    orientation: "horizontal",
    appearance: "solid",
    thickness: "thin",
    variant: "neutral",
  },
});

export type SeparatorVariants = VariantProps<typeof separatorVariants>;

export type PimoluSeparatorOrientation =
  keyof typeof separatorVariantMap.orientation;
export type PimoluSeparatorAppearance =
  keyof typeof separatorVariantMap.appearance;
export type PimoluSeparatorThickness =
  keyof typeof separatorVariantMap.thickness;
export type PimoluSeparatorVariant =
  keyof typeof separatorVariantMap.variant;
