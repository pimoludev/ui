"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type CSSProperties,
} from "react";

import type {
  PimoluCircularProgressProps,
} from "./circular-progress.types";

import {
  circularProgressVariants,
} from "./circular-progress.variants";

/* =========================================
   CIRCULAR PROGRESS
========================================= */

export const CircularProgress = forwardRef<
  HTMLDivElement,
  PimoluCircularProgressProps
>(function CircularProgress(
  { classNames,
    value,
    max = 100,

    size = "md",
    variant = "primary",

    label,
    showValue = false,
    formatValue,
    valueLabel,

    className,

    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("circular-progress", classNames, true);

  const indeterminate =
    value === undefined ||
    !Number.isFinite(value);

  const validMax = Number.isFinite(max) && max > 0;
  const effectiveMax = validMax ? max : 100;
  const clamped = indeterminate || !validMax
    ? 0
    : Math.min(Math.max(value, 0), effectiveMax);

  const percent = (clamped / effectiveMax) * 100;

  const displayed = formatValue
    ? formatValue(clamped, effectiveMax)
    : `${Math.round(percent)}%`;

  /* Classes */

  const classes = [
    circularProgressVariants({ size, variant }),

    indeterminate &&
      "pimolu-circular-progress--indeterminate",

    className,
  ].filter(Boolean).join(" ");

  /* pathLength="100" turns the dash values into percentages of the
     circumference, whatever the radius is. */

  const indicatorStyle = {
    "--pimolu-circular-progress-offset":
      `${100 - percent}`,
  } as CSSProperties;

  return scopeParts((
    <div
      {...props}
      ref={forwardedRef}
      className={mergeClasses(classes, partClasses.root)}
      data-empty={!indeterminate && percent === 0 ? "true" : undefined}
      data-complete={!indeterminate && percent === 100 ? "true" : undefined}

      role="progressbar"

      aria-label={label ?? ariaLabel}
      aria-describedby={ariaDescribedBy}

      aria-valuemin={0}
      aria-valuemax={effectiveMax}
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-valuetext={valueLabel}
    >
      <svg
        className={mergeClasses("pimolu-circular-progress__svg", partClasses.svg)}
        viewBox="0 0 40 40"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          className={mergeClasses("pimolu-circular-progress__track", partClasses.track)}
          cx="20"
          cy="20"
          r="17"
          pathLength={100}
        />

        <circle
          className={mergeClasses("pimolu-circular-progress__indicator", partClasses.indicator)}
          cx="20"
          cy="20"
          r="17"
          pathLength={100}
          style={indicatorStyle}
        />
      </svg>

      {showValue && !indeterminate && (
        /* The progressbar already exposes its value,
           so the readout is decorative. */
        <span
          className={mergeClasses("pimolu-circular-progress__value", partClasses.value)}
          aria-hidden="true"
          title={displayed}
        >
          {displayed}
        </span>
      )}
    </div>
  ));
});

CircularProgress.displayName = "PimoluCircularProgress";
