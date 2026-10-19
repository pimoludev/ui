
import { forwardRef } from "react";

import type {
  PimoluSeparatorProps,
} from "./separator.types";

import { separatorVariants } from "./separator.variants";

/* ==================================
   SEPARATOR
================================== */

export const Separator = forwardRef<
  HTMLDivElement,
  PimoluSeparatorProps
>(function Separator(
  {
    orientation = "horizontal",
    appearance = "solid",
    thickness = "thin",
    variant = "neutral",
    decorative = true,

    className,

    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,

    ...props
  },
  ref
) {
  const separatorClassName = [
    separatorVariants({
      orientation,
      appearance,
      thickness,
      variant,
    }),

    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...props}
      ref={ref}
      className={separatorClassName}

      role={decorative ? "none" : "separator"}

      aria-hidden={decorative ? true : undefined}

      aria-orientation={
        decorative ? undefined : orientation
      }

      aria-label={
        decorative ? undefined : ariaLabel
      }

      aria-labelledby={
        decorative ? undefined : ariaLabelledBy
      }

      data-orientation={orientation}
      data-decorative={decorative ? "true" : "false"}
    />
  );
});

Separator.displayName = "PimoluSeparator";
