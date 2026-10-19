import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the CircularProgress axes.
 *
 * The stroke width belongs to the size, because the SVG scales as a whole:
 * a 24px gauge cannot carry the same stroke as a 64px one.
 */
export const circularProgressVariantMap = {
  size: {
    sm: "pimolu-circular-progress--sm",
    md: "pimolu-circular-progress--md",
    lg: "pimolu-circular-progress--lg",
  },

  variant: {
    neutral: "pimolu-circular-progress--neutral",
    primary: "pimolu-circular-progress--primary",
    secondary: "pimolu-circular-progress--secondary",
    success: "pimolu-circular-progress--success",
    warning: "pimolu-circular-progress--warning",
    danger: "pimolu-circular-progress--danger",
  },
} as const;

export const circularProgressVariants = createVariants({
  base: "pimolu-circular-progress",
  variants: circularProgressVariantMap,

  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export type CircularProgressVariants = VariantProps<
  typeof circularProgressVariants
>;

export type PimoluCircularProgressSize =
  keyof typeof circularProgressVariantMap.size;

export type PimoluCircularProgressVariant =
  keyof typeof circularProgressVariantMap.variant;
