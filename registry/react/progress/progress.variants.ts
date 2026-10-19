import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Progress axes.
 *
 * A progress bar has no surface of its own, so there is no appearance axis:
 * the size drives the track height and the variant the filled tone.
 */
export const progressVariantMap = {
  size: {
    sm: "pimolu-progress--sm",
    md: "pimolu-progress--md",
    lg: "pimolu-progress--lg",
  },

  variant: {
    neutral: "pimolu-progress--neutral",
    primary: "pimolu-progress--primary",
    secondary: "pimolu-progress--secondary",
    success: "pimolu-progress--success",
    warning: "pimolu-progress--warning",
    danger: "pimolu-progress--danger",
  },
} as const;

export const progressVariants = createVariants({
  base: "pimolu-progress",
  variants: progressVariantMap,

  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export type ProgressVariants = VariantProps<
  typeof progressVariants
>;

export type PimoluProgressSize =
  keyof typeof progressVariantMap.size;

export type PimoluProgressVariant =
  keyof typeof progressVariantMap.variant;
