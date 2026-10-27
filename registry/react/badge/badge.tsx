
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";

import { forwardRef } from "react";

import type {
  PimoluBadgeProps,
} from "./badge.types";

import { badgeVariants } from "./badge.variants";

export const Badge = forwardRef<
  HTMLSpanElement,
  PimoluBadgeProps
>(function Badge(
  { classNames,
    children,
    className,

    variant = "neutral",
    appearance = "soft",
    size = "md",
    radius = "md",

    dot = false,
    startIcon,
    endIcon,

    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("badge", classNames, true);

  const badgeClassName = [
    badgeVariants({ variant, appearance, size, radius }),

    dot && "pimolu-badge--with-dot",

    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <span
      {...props}
      ref={ref}
      className={mergeClasses(badgeClassName, partClasses.root)}
    >
      {dot && (
        <span
          className={mergeClasses("pimolu-badge__dot", partClasses.dot)}
          aria-hidden="true"
        />
      )}

      {startIcon != null && (
        <span
          className={mergeClasses("pimolu-badge__start-icon", partClasses.startIcon)}
          aria-hidden="true"
        >
          {startIcon}
        </span>
      )}

      {children != null && (
        <span className={mergeClasses("pimolu-badge__label", partClasses.label)}>
          {children}
        </span>
      )}

      {endIcon != null && (
        <span
          className={mergeClasses("pimolu-badge__end-icon", partClasses.endIcon)}
          aria-hidden="true"
        >
          {endIcon}
        </span>
      )}
    </span>
  ));
});

Badge.displayName = "PimoluBadge";
