import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Link axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const linkVariantMap = {
  variant: {
    primary: "pimolu-link--primary",
    muted: "pimolu-link--muted",
    inherit: "pimolu-link--inherit",
  },

  underline: {
    hover: "pimolu-link--underline-hover",
    always: "pimolu-link--underline-always",
    none: "pimolu-link--underline-none",
  },
} as const;

export const linkVariants = createVariants({
  base: "pimolu-link",
  variants: linkVariantMap,

  defaultVariants: {
    variant: "primary",
    underline: "hover",
  },
});

export type LinkVariants = VariantProps<
  typeof linkVariants
>;

export type PimoluLinkVariant =
  keyof typeof linkVariantMap.variant;

export type PimoluLinkUnderline =
  keyof typeof linkVariantMap.underline;
