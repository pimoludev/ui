import { createVariants } from "@pimolu/core";

/**
 * Single source of truth for the typography axes. The classes are shared by
 * Text, Paragraph and Heading; the base class is what changes the element.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them.
 */
export const typographyVariantMap = {
  size: {
    xs: "pimolu-typography--xs",
    sm: "pimolu-typography--sm",
    md: "pimolu-typography--md",
    lg: "pimolu-typography--lg",
    xl: "pimolu-typography--xl",
    "2xl": "pimolu-typography--2xl",
    "3xl": "pimolu-typography--3xl",
  },

  weight: {
    normal: "pimolu-typography--weight-normal",
    medium: "pimolu-typography--weight-medium",
    semibold: "pimolu-typography--weight-semibold",
    bold: "pimolu-typography--weight-bold",
  },

  tone: {
    default: "pimolu-typography--tone-default",
    muted: "pimolu-typography--tone-muted",
    primary: "pimolu-typography--tone-primary",
    success: "pimolu-typography--tone-success",
    warning: "pimolu-typography--tone-warning",
    danger: "pimolu-typography--tone-danger",
  },
} as const;

export const textVariants = createVariants({
  base: "pimolu-text",
  variants: typographyVariantMap,

  defaultVariants: {
    size: "sm",
    weight: "normal",
    tone: "default",
  },
});

export const paragraphVariants = createVariants({
  base: "pimolu-paragraph",
  variants: typographyVariantMap,

  defaultVariants: {
    size: "md",
    weight: "normal",
    tone: "default",
  },
});

export const headingVariants = createVariants({
  base: "pimolu-heading",
  variants: typographyVariantMap,

  defaultVariants: {
    size: "2xl",
    weight: "semibold",
    tone: "default",
  },
});

export type PimoluTypographySize =
  keyof typeof typographyVariantMap.size;

export type PimoluTypographyWeight =
  keyof typeof typographyVariantMap.weight;

export type PimoluTypographyTone =
  keyof typeof typographyVariantMap.tone;
