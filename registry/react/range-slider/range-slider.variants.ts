import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the RangeSlider axes.
 *
 * Same reasoning as Slider: no `appearance` axis, because a range has no
 * surface to restyle. Size drives the metrics, variant drives the tone of the
 * selected segment.
 */
export const rangeSliderVariantMap = {
  size: {
    sm: "pimolu-range-slider--sm",
    md: "pimolu-range-slider--md",
    lg: "pimolu-range-slider--lg",
  },

  variant: {
    neutral: "pimolu-range-slider--neutral",
    primary: "pimolu-range-slider--primary",
    secondary: "pimolu-range-slider--secondary",
    success: "pimolu-range-slider--success",
    warning: "pimolu-range-slider--warning",
    danger: "pimolu-range-slider--danger",
  },
} as const;

export const rangeSliderVariants = createVariants({
  base: "pimolu-range-slider",
  variants: rangeSliderVariantMap,

  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export type RangeSliderVariants = VariantProps<
  typeof rangeSliderVariants
>;

export type PimoluRangeSliderSize =
  keyof typeof rangeSliderVariantMap.size;

export type PimoluRangeSliderVariant =
  keyof typeof rangeSliderVariantMap.variant;
