import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the AvatarGroup axes.
 *
 * The size and shape classes mirror the ones applied to the avatars; the
 * spacing axis drives the overlap. Exported so consumers can enumerate the
 * options instead of duplicating them.
 */
export const avatarGroupVariantMap = {
  size: {
    xs: "pimolu-avatar-group--xs",
    sm: "pimolu-avatar-group--sm",
    md: "pimolu-avatar-group--md",
    lg: "pimolu-avatar-group--lg",
    xl: "pimolu-avatar-group--xl",
  },

  shape: {
    circle: "pimolu-avatar-group--circle",
    rounded: "pimolu-avatar-group--rounded",
    square: "pimolu-avatar-group--square",
  },

  spacing: {
    tight: "pimolu-avatar-group--spacing-tight",
    normal: "pimolu-avatar-group--spacing-normal",
    loose: "pimolu-avatar-group--spacing-loose",
  },
} as const;

export const avatarGroupVariants = createVariants({
  base: "pimolu-avatar-group",
  variants: avatarGroupVariantMap,

  defaultVariants: {
    size: "md",
    shape: "circle",
    spacing: "normal",
  },
});

export type AvatarGroupVariants = VariantProps<typeof avatarGroupVariants>;

export type PimoluAvatarGroupSpacing =
  keyof typeof avatarGroupVariantMap.spacing;
