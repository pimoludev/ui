import { createVariants } from "@pimolu/core";

export const pageHeaderVariantMap = {
  size: {
    sm: "pimolu-page-header--sm",
    md: "pimolu-page-header--md",
    lg: "pimolu-page-header--lg",
  },
} as const;

export const pageHeaderVariants = createVariants({
  base: "pimolu-page-header",
  variants: pageHeaderVariantMap,
  defaultVariants: { size: "md" },
});
