
import { forwardRef } from "react";

import type {
  PimoluBadgeProps,
} from "./badge.types";

import { badgeVariants } from "./badge.variants";

export const Badge = forwardRef<
  HTMLSpanElement,
  PimoluBadgeProps
>(function Badge(
  {
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
  const badgeClassName = [
    badgeVariants({ variant, appearance, size, radius }),

    dot && "pimolu-badge--with-dot",

    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      {...props}
      ref={ref}
      className={badgeClassName}
    >
      {dot && (
        <span
          className="pimolu-badge__dot"
          aria-hidden="true"
        />
      )}

      {startIcon != null && (
        <span
          className="pimolu-badge__start-icon"
          aria-hidden="true"
        >
          {startIcon}
        </span>
      )}

      {children != null && (
        <span className="pimolu-badge__label">
          {children}
        </span>
      )}

      {endIcon != null && (
        <span
          className="pimolu-badge__end-icon"
          aria-hidden="true"
        >
          {endIcon}
        </span>
      )}
    </span>
  );
});

Badge.displayName = "PimoluBadge";
