import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Textarea axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const textareaVariantMap = {
  size: {
    xs: "pimolu-textarea--xs",
    sm: "pimolu-textarea--sm",
    md: "pimolu-textarea--md",
    lg: "pimolu-textarea--lg",
    xl: "pimolu-textarea--xl",
    xxl: "pimolu-textarea--xxl",
  },

  variant: {
    neutral: "pimolu-textarea--neutral",
    primary: "pimolu-textarea--primary",
    secondary: "pimolu-textarea--secondary",
    success: "pimolu-textarea--success",
    warning: "pimolu-textarea--warning",
    danger: "pimolu-textarea--danger",
  },

  appearance: {
    outline: "pimolu-textarea--outline",
    soft: "pimolu-textarea--soft",
    filled: "pimolu-textarea--filled",
    glass: "pimolu-textarea--glass",
  },

  resize: {
    none: "pimolu-textarea--resize-none",
    vertical: "pimolu-textarea--resize-vertical",
    horizontal: "pimolu-textarea--resize-horizontal",
    both: "pimolu-textarea--resize-both",
  },
} as const;

export const textareaVariants = createVariants({
  base: "pimolu-textarea",
  variants: textareaVariantMap,

  defaultVariants: {
    size: "md",
    variant: "neutral",
    appearance: "outline",
    resize: "vertical",
  },
});

export type TextareaVariants = VariantProps<typeof textareaVariants>;

export type PimoluTextareaSize =
  keyof typeof textareaVariantMap.size;
export type PimoluTextareaVariant =
  keyof typeof textareaVariantMap.variant;
export type PimoluTextareaAppearance =
  keyof typeof textareaVariantMap.appearance;
export type PimoluTextareaResize =
  keyof typeof textareaVariantMap.resize;
