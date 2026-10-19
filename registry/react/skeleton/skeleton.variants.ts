import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Skeleton axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const skeletonVariantMap = {
  shape: {
    text: "pimolu-skeleton--text",
    rectangular: "pimolu-skeleton--rectangular",
    rounded: "pimolu-skeleton--rounded",
    circular: "pimolu-skeleton--circular",
  },

  animation: {
    pulse: "pimolu-skeleton--pulse",
    wave: "pimolu-skeleton--wave",
    none: "pimolu-skeleton--none",
  },
} as const;

export const skeletonVariants = createVariants({
  base: "pimolu-skeleton",
  variants: skeletonVariantMap,

  defaultVariants: {
    shape: "text",
    animation: "pulse",
  },
});

export type SkeletonVariants = VariantProps<typeof skeletonVariants>;

export type PimoluSkeletonShape =
  keyof typeof skeletonVariantMap.shape;
export type PimoluSkeletonAnimation =
  keyof typeof skeletonVariantMap.animation;
