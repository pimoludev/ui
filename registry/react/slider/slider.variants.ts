import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Slider axes.
 *
 * There is deliberately no `appearance` axis: a range input has no surface to
 * restyle, so the axis would be decorative. Size drives the metrics, variant
 * drives the filled tone.
 */
export const sliderVariantMap = {
  size: {
    sm: "pimolu-slider--sm",
    md: "pimolu-slider--md",
    lg: "pimolu-slider--lg",
  },

  variant: {
    neutral: "pimolu-slider--neutral",
    primary: "pimolu-slider--primary",
    secondary: "pimolu-slider--secondary",
    success: "pimolu-slider--success",
    warning: "pimolu-slider--warning",
    danger: "pimolu-slider--danger",
  },
} as const;

export const sliderVariants = createVariants({
  base: "pimolu-slider",
  variants: sliderVariantMap,

  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export type SliderVariants = VariantProps<typeof sliderVariants>;

export type PimoluSliderSize = keyof typeof sliderVariantMap.size;
export type PimoluSliderVariant =
  keyof typeof sliderVariantMap.variant;
