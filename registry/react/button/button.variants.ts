import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Button variant axes.
 *
 * Publicly exported (through the package entry) so consumers such as the
 * playground and the docs can enumerate the options
 * instead of duplicating them.
 */
export const buttonVariantMap = {
  variant: {
    primary: "pimolu-button--primary",
    secondary: "pimolu-button--secondary",
    neutral: "pimolu-button--neutral",
    success: "pimolu-button--success",
    warning: "pimolu-button--warning",
    danger: "pimolu-button--danger",
  },

  appearance: {
    solid: "pimolu-button--solid",
    soft: "pimolu-button--soft",
    outline: "pimolu-button--outline",
    ghost: "pimolu-button--ghost",
    link: "pimolu-button--link",
    dashed: "pimolu-button--dashed",
    glass: "pimolu-button--glass",
    elevated: "pimolu-button--elevated",
    glow: "pimolu-button--glow",
    text: "pimolu-button--text",
  },

  size: {
    xs: "pimolu-button--xs",
    sm: "pimolu-button--sm",
    md: "pimolu-button--md",
    lg: "pimolu-button--lg",
    xl: "pimolu-button--xl",
    xxl: "pimolu-button--xxl",
  },

  radius: {
    none: "pimolu-button--radius-none",
    sm: "pimolu-button--radius-sm",
    md: "pimolu-button--radius-md",
    lg: "pimolu-button--radius-lg",
    full: "pimolu-button--radius-full",
  },
} as const;

export const buttonVariants = createVariants({
  base: "pimolu-button",
  variants: buttonVariantMap,

  defaultVariants: {
    variant: "primary",
    appearance: "solid",
    size: "md",
    radius: "md",
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonVariant = keyof typeof buttonVariantMap.variant;
export type ButtonAppearance = keyof typeof buttonVariantMap.appearance;
export type ButtonSize = keyof typeof buttonVariantMap.size;
export type ButtonRadius = keyof typeof buttonVariantMap.radius;
