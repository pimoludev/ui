"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useId,
  type CSSProperties,
} from "react";

import type { PimoluProgressProps } from "./progress.types";

import { progressVariants } from "./progress.variants";

/* =========================================
   PROGRESS
========================================= */

export const Progress = forwardRef<
  HTMLDivElement,
  PimoluProgressProps
>(function Progress(
  { classNames,
    id,

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
  const [partClasses, scopeParts] = usePartClasses("progress", classNames, true);

  const generatedId = useId();

  const labelId =
    `${id ?? `pimolu-progress-${generatedId}`}-label`;

  /* No value means no known completion: the bar is indeterminate. */

  const indeterminate =
    value === undefined ||
    !Number.isFinite(value);

  const clamped = indeterminate
    ? 0
    : Math.min(Math.max(value, 0), max);

  const percent = max > 0
    ? (clamped / max) * 100
    : 0;

  const displayed = formatValue
    ? formatValue(clamped, max)
    : `${Math.round(percent)}%`;

  /* Classes */

  const classes = [
    progressVariants({ size, variant }),

    indeterminate && "pimolu-progress--indeterminate",

    className,
  ].filter(Boolean).join(" ");

  const fillStyle = {
    "--pimolu-progress-value": `${percent}%`,
  } as CSSProperties;

  return scopeParts((
    <div
      {...props}
      ref={forwardedRef}
      className={mergeClasses(classes, partClasses.root)}
    >
      {(label || showValue) && (
        <div className={mergeClasses("pimolu-progress__header", partClasses.header)}>
          {label && (
            <span
              id={labelId}
              className={mergeClasses("pimolu-progress__label", partClasses.label)}
            >
              {label}
            </span>
          )}

          {showValue && !indeterminate && (
            /* The progressbar already exposes its value,
               so the readout is decorative. */
            <span
              className={mergeClasses("pimolu-progress__value", partClasses.value)}
              aria-hidden="true"
            >
              {displayed}
            </span>
          )}
        </div>
      )}

      <div
        className={mergeClasses("pimolu-progress__track", partClasses.track)}

        role="progressbar"

        aria-labelledby={
          label ? labelId : undefined
        }

        aria-label={label ? undefined : ariaLabel}
        aria-describedby={ariaDescribedBy}

        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={
          indeterminate ? undefined : clamped
        }
        aria-valuetext={valueLabel}
      >
        <div
          className={mergeClasses("pimolu-progress__fill", partClasses.fill)}
          style={fillStyle}
        />
      </div>
    </div>
  ));
});

Progress.displayName = "PimoluProgress";
