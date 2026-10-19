import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Code and Kbd size axis.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const codeVariantMap = {
  size: {
    sm: "pimolu-code-kbd--sm",
    md: "pimolu-code-kbd--md",
    lg: "pimolu-code-kbd--lg",
  },
} as const;

export const codeVariants = createVariants({
  base: "pimolu-code",
  variants: codeVariantMap,

  defaultVariants: {
    size: "sm",
  },
});

export const kbdVariants = createVariants({
  base: "pimolu-kbd",
  variants: codeVariantMap,

  defaultVariants: {
    size: "sm",
  },
});

export type CodeVariants = VariantProps<
  typeof codeVariants
>;

export type PimoluCodeSize =
  keyof typeof codeVariantMap.size;
