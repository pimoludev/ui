import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Avatar variant axes.
 *
 * Publicly exported (through the package entry) so consumers such as the
 * playground, the docs and the examples can enumerate the options instead of
 * duplicating them, exactly like the other components.
 */
export const avatarVariantMap = {
  size: {
    xs: "pimolu-avatar--xs",
    sm: "pimolu-avatar--sm",
    md: "pimolu-avatar--md",
    lg: "pimolu-avatar--lg",
    xl: "pimolu-avatar--xl",
  },

  shape: {
    circle: "pimolu-avatar--circle",
    rounded: "pimolu-avatar--rounded",
    square: "pimolu-avatar--square",
  },
} as const;

export const avatarVariants = createVariants({
  base: "pimolu-avatar",
  variants: avatarVariantMap,

  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;

export type PimoluAvatarSize = keyof typeof avatarVariantMap.size;
export type PimoluAvatarShape = keyof typeof avatarVariantMap.shape;
