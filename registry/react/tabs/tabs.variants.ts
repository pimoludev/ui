import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Tabs axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const tabsVariantMap = {
  variant: {
    line: "pimolu-tabs--line",
    solid: "pimolu-tabs--solid",
    soft: "pimolu-tabs--soft",
    segmented: "pimolu-tabs--segmented",
  },

  size: {
    sm: "pimolu-tabs--sm",
    md: "pimolu-tabs--md",
    lg: "pimolu-tabs--lg",
  },
} as const;

export const tabsVariants = createVariants({
  base: "pimolu-tabs",
  variants: tabsVariantMap,

  defaultVariants: {
    variant: "line",
    size: "md",
  },
});

export type TabsVariants = VariantProps<
  typeof tabsVariants
>;

export type PimoluTabsVariant =
  keyof typeof tabsVariantMap.variant;

export type PimoluTabsSize =
  keyof typeof tabsVariantMap.size;
