import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Radio and RadioGroup axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const radioVariantMap = {
  size: {
    sm: "pimolu-radio--sm",
    md: "pimolu-radio--md",
    lg: "pimolu-radio--lg",
  },

  variant: {
    neutral: "pimolu-radio--neutral",
    primary: "pimolu-radio--primary",
    secondary: "pimolu-radio--secondary",
    success: "pimolu-radio--success",
    warning: "pimolu-radio--warning",
    danger: "pimolu-radio--danger",
  },
} as const;

export const radioGroupVariantMap = {
  orientation: {
    vertical: "pimolu-radio-group--vertical",
    horizontal: "pimolu-radio-group--horizontal",
  },
} as const;

export const radioVariants = createVariants({
  base: "pimolu-radio",
  variants: radioVariantMap,

  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export const radioGroupVariants = createVariants({
  base: "pimolu-radio-group",
  variants: radioGroupVariantMap,

  defaultVariants: {
    orientation: "vertical",
  },
});

export type RadioVariants = VariantProps<typeof radioVariants>;
export type RadioGroupVariants =
  VariantProps<typeof radioGroupVariants>;

export type PimoluRadioSize = keyof typeof radioVariantMap.size;
export type PimoluRadioVariant =
  keyof typeof radioVariantMap.variant;
export type PimoluRadioOrientation =
  keyof typeof radioGroupVariantMap.orientation;
