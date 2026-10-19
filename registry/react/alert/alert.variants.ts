import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Alert variant axis.
 *
 * Publicly exported so consumers can enumerate the semantic tones instead of
 * duplicating them, exactly like the Badge and the Card.
 */
export const alertVariantMap = {
  variant: {
    info: "pimolu-alert--info",
    success: "pimolu-alert--success",
    warning: "pimolu-alert--warning",
    danger: "pimolu-alert--danger",
    neutral: "pimolu-alert--neutral",
  },
} as const;

export const alertVariants = createVariants({
  base: "pimolu-alert",
  variants: alertVariantMap,

  defaultVariants: {
    variant: "info",
  },
});

export type AlertVariants = VariantProps<typeof alertVariants>;

export type PimoluAlertVariant =
  keyof typeof alertVariantMap.variant;
