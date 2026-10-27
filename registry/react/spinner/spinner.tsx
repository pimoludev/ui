
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";

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
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("spinner", classNames, true);

  const spinnerClassName = [
    spinnerVariants({ appearance, size, variant }),

    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <span
      {...props}
      ref={ref}
      className={mergeClasses(spinnerClassName, partClasses.root)}
      role={decorative ? undefined : "status"}
      aria-hidden={decorative ? true : undefined}
      data-appearance={appearance}
      data-decorative={decorative ? "true" : "false"}
    >
      {/* Visual element */}

      <span
        className={mergeClasses("pimolu-spinner__visual", partClasses.visual)}
        aria-hidden="true"
      >
        {appearance === "dots" ? (
          <>
            <span className={mergeClasses("pimolu-spinner__dot", partClasses.dot)} />
            <span className={mergeClasses("pimolu-spinner__dot", partClasses.dot)} />
            <span className={mergeClasses("pimolu-spinner__dot", partClasses.dot)} />
          </>
        ) : (
          <svg
            className={mergeClasses("pimolu-spinner__svg", partClasses.svg)}
            viewBox="0 0 24 24"
            fill="none"
            focusable="false"
          >
            <circle
              className={mergeClasses("pimolu-spinner__track", partClasses.track)}
              cx="12"
              cy="12"
              r="9"
            />

            <circle
              className={mergeClasses("pimolu-spinner__indicator", partClasses.indicator)}
              cx="12"
              cy="12"
              r="9"
            />
          </svg>
        )}
      </span>

      {/* Screen reader message */}

      {!decorative && (
        <span className={mergeClasses("pimolu-spinner__label", partClasses.label)}>
          {label}
        </span>
      )}
    </span>
  ));
});

Spinner.displayName = "PimoluSpinner";
