import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Input variant axes.
 *
 * Publicly exported (through the package entry) so consumers such as the
 * playground, the docs and the examples can enumerate the options instead of
 * duplicating them, exactly like the Button does.
 */
export const inputVariantMap = {
  size: {
    xs: "pimolu-input--xs",
    sm: "pimolu-input--sm",
    md: "pimolu-input--md",
    lg: "pimolu-input--lg",
    xl: "pimolu-input--xl",
    xxl: "pimolu-input--xxl",
  },

  variant: {
    primary: "pimolu-input--primary",
    secondary: "pimolu-input--secondary",
    neutral: "pimolu-input--neutral",
    success: "pimolu-input--success",
    warning: "pimolu-input--warning",
    danger: "pimolu-input--danger",
  },

  appearance: {
    outline: "pimolu-input--outline",
    soft: "pimolu-input--soft",
    filled: "pimolu-input--filled",
    glass: "pimolu-input--glass",
  },
} as const;

export const inputVariants = createVariants({
  base: "pimolu-input",
  variants: inputVariantMap,

  defaultVariants: {
    size: "md",
    variant: "neutral",
    appearance: "outline",
  },
});

export type InputVariants = VariantProps<typeof inputVariants>;

export type PimoluInputSize = keyof typeof inputVariantMap.size;
export type PimoluInputVariant = keyof typeof inputVariantMap.variant;
export type PimoluInputAppearance = keyof typeof inputVariantMap.appearance;
