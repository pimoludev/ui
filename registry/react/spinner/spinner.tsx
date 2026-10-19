
import { forwardRef } from "react";

import type {
  PimoluSpinnerProps,
} from "./spinner.types";

import { spinnerVariants } from "./spinner.variants";

/* ==================================
   SPINNER
================================== */

export const Spinner = forwardRef<
  HTMLSpanElement,
  PimoluSpinnerProps
>(function Spinner(
  {
    appearance = "circular",
    size = "md",
    variant = "inherit",

    label = "Loading...",
    decorative = false,

    className,
    ...props
  },
  ref
) {
  const spinnerClassName = [
    spinnerVariants({ appearance, size, variant }),

    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      {...props}
      ref={ref}
      className={spinnerClassName}
      role={decorative ? undefined : "status"}
      aria-hidden={decorative ? true : undefined}
      data-appearance={appearance}
      data-decorative={decorative ? "true" : "false"}
    >
      {/* Visual element */}

      <span
        className="pimolu-spinner__visual"
        aria-hidden="true"
      >
        {appearance === "dots" ? (
          <>
            <span className="pimolu-spinner__dot" />
            <span className="pimolu-spinner__dot" />
            <span className="pimolu-spinner__dot" />
          </>
        ) : (
          <svg
            className="pimolu-spinner__svg"
            viewBox="0 0 24 24"
            fill="none"
            focusable="false"
          >
            <circle
              className="pimolu-spinner__track"
              cx="12"
              cy="12"
              r="9"
            />

            <circle
              className="pimolu-spinner__indicator"
              cx="12"
              cy="12"
              r="9"
            />
          </svg>
        )}
      </span>

      {/* Screen reader message */}

      {!decorative && (
        <span className="pimolu-spinner__label">
          {label}
        </span>
      )}
    </span>
  );
});

Spinner.displayName = "PimoluSpinner";
