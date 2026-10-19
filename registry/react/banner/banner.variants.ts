import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Banner variant axis.
 */
export const bannerVariantMap = {
  variant: {
    info: "pimolu-banner--info",
    success: "pimolu-banner--success",
    warning: "pimolu-banner--warning",
    danger: "pimolu-banner--danger",
    neutral: "pimolu-banner--neutral",
  },
} as const;

export const bannerVariants = createVariants({
  base: "pimolu-banner",
  variants: bannerVariantMap,

  defaultVariants: {
    variant: "info",
  },
});

export type BannerVariants = VariantProps<typeof bannerVariants>;

export type PimoluBannerVariant =
  keyof typeof bannerVariantMap.variant;
