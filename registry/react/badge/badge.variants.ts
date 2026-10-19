import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Badge variant axes.
 *
 * Publicly exported (through the package entry) so consumers such as the
 * playground, the docs and the examples can enumerate the options instead of
 * duplicating them, exactly like the Button, the Input and the Card.
 */
export const badgeVariantMap = {
  variant: {
    neutral: "pimolu-badge--neutral",
    primary: "pimolu-badge--primary",
    secondary: "pimolu-badge--secondary",
    success: "pimolu-badge--success",
    warning: "pimolu-badge--warning",
    danger: "pimolu-badge--danger",
  },

  appearance: {
    solid: "pimolu-badge--solid",
    soft: "pimolu-badge--soft",
    outline: "pimolu-badge--outline",
    glass: "pimolu-badge--glass",
  },

  size: {
    sm: "pimolu-badge--sm",
    md: "pimolu-badge--md",
    lg: "pimolu-badge--lg",
  },

  radius: {
    none: "pimolu-badge--radius-none",
    sm: "pimolu-badge--radius-sm",
    md: "pimolu-badge--radius-md",
    lg: "pimolu-badge--radius-lg",
    full: "pimolu-badge--radius-full",
  },
} as const;

export const badgeVariants = createVariants({
  base: "pimolu-badge",
  variants: badgeVariantMap,

  defaultVariants: {
    variant: "neutral",
    appearance: "soft",
    size: "md",
    radius: "md",
  },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export type PimoluBadgeVariant = keyof typeof badgeVariantMap.variant;
export type PimoluBadgeAppearance = keyof typeof badgeVariantMap.appearance;
export type PimoluBadgeSize = keyof typeof badgeVariantMap.size;
export type PimoluBadgeRadius = keyof typeof badgeVariantMap.radius;
