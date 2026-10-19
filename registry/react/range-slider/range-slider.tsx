"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";

import type {
  PimoluRangeSliderProps,
  PimoluRangeSliderValue,
} from "./range-slider.types";

import { rangeSliderVariants } from "./range-slider.variants";

import { useFormReset } from "../internal/use-form-reset";

/* =========================================
   HELPERS
========================================= */

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Clamps both bounds into the range and guarantees the lower bound comes
 * first, so a caller can pass [80, 20] without breaking the component.
 */
function order(
  value: PimoluRangeSliderValue,
  min: number,
  max: number
): PimoluRangeSliderValue {
  const first = Number.isFinite(value[0])
    ? clamp(value[0], min, max)
    : min;

  const second = Number.isFinite(value[1])
    ? clamp(value[1], min, max)
    : max;

  return first <= second
    ? [first, second]
    : [second, first];
}

/* =========================================
   RANGE SLIDER
========================================= */

export const RangeSlider = forwardRef<
  HTMLDivElement,
  PimoluRangeSliderProps
>(function RangeSlider(
  {
    id,
    label,
    helperText,
    errorMessage,
    invalid = false,

    size = "md",
    variant = "primary",

    min = 0,
    max = 100,
    step = 1,

    value,
    defaultValue,
    onValueChange,

    showValue = false,
    formatValue,

    minLabel = "Minimum",
    maxLabel = "Maximum",

    name,
    nameMin,
    nameMax,

    disabled = false,
    required = false,

    className,
    containerClassName,
    containerStyle,

    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,

    ...props
  },
  forwardedRef
) {
  const generatedId = useId();
  const baseId = id ?? `pimolu-range-slider-${generatedId}`;

  const labelId = `${baseId}-label`;
  const minId = `${baseId}-min`;
  const maxId = `${baseId}-max`;

  const minRef = useRef<HTMLInputElement | null>(null);
  const maxRef = useRef<HTMLInputElement | null>(null);

  const controlled = value !== undefined;

  /* The DOM default must stay at the mount value, otherwise a native
     reset would restore the value the user just dragged to. */

  const [initialValue] = useState<PimoluRangeSliderValue>(
    () => order(defaultValue ?? [min, max], min, max)
  );

  const [internalValue, setInternalValue] =
    useState<PimoluRangeSliderValue>(initialValue);

  const current = controlled
    ? order(value, min, max)
    : internalValue;

  const [lower, upper] = current;

  useFormReset(minRef, !controlled, () => {
    setInternalValue(initialValue);
  });

  function emit(
    next: PimoluRangeSliderValue
  ) {
    if (!controlled) {
      setInternalValue(next);
    }

    onValueChange?.(next);
  }

  function handleLowerChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const next = event.currentTarget.valueAsNumber;

    if (!Number.isFinite(next)) return;

    emit([Math.min(next, upper), upper]);
  }

  function handleUpperChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const next = event.currentTarget.valueAsNumber;

    if (!Number.isFinite(next)) return;

    emit([lower, Math.max(next, lower)]);
  }

  /* Accessibility */

  const hasError = invalid || Boolean(errorMessage);

  const message = errorMessage || helperText;

  const messageId = message
    ? `${baseId}-message`
    : undefined;

  const describedBy = [
    ariaDescribedBy,
    messageId,
  ].filter(Boolean).join(" ") || undefined;

  const handlePrefix = label ?? ariaLabel;

  const lowerName = handlePrefix
    ? `${handlePrefix} (${minLabel})`
    : minLabel;

  const upperName = handlePrefix
    ? `${handlePrefix} (${maxLabel})`
    : maxLabel;

  const displayedValue = formatValue
    ? formatValue(current)
    : `${lower} \u2013 ${upper}`;

  /* Fill percentages, exposed to CSS as custom properties. */

  const span = max - min;

  const percentOf = (value: number) =>
    span > 0
      ? clamp(((value - min) / span) * 100, 0, 100)
      : 0;

  const controlStyle = {
    "--pimolu-range-slider-start": `${percentOf(lower)}%`,
    "--pimolu-range-slider-end": `${percentOf(upper)}%`,
  } as CSSProperties;

  /* Names */

  const resolvedNameMin =
    nameMin ?? (name ? `${name}Min` : undefined);

  const resolvedNameMax =
    nameMax ?? (name ? `${name}Max` : undefined);

  /* Classes */

  const containerClasses = [
    rangeSliderVariants({ size, variant }),

    hasError && "pimolu-range-slider--invalid",
    disabled && "pimolu-range-slider--disabled",

    containerClassName,
  ].filter(Boolean).join(" ");

  const inputClasses = [
    "pimolu-range-slider__input",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={forwardedRef}
      role="group"
      aria-labelledby={label ? labelId : undefined}
      aria-label={label ? undefined : ariaLabel}
      className={containerClasses}
      style={containerStyle}
    >
      {(label || showValue) && (
        <div className="pimolu-range-slider__header">
          {label && (
            <span
              id={labelId}
              className="pimolu-range-slider__label"
            >
              {label}

              {required && (
                <span
                  className="pimolu-range-slider__required"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </span>
          )}

          {showValue && (
            /* Each range announces its own value, so the
               shared readout is decorative. */
            <span
              className="pimolu-range-slider__value"
              aria-hidden="true"
            >
              {displayedValue}
            </span>
          )}
        </div>
      )}

      <div
        className="pimolu-range-slider__control"
        style={controlStyle}
      >
        <div
          className="pimolu-range-slider__track"
          aria-hidden="true"
        />

        <input
          {...props}
          ref={minRef}
          id={minId}
          type="range"

          className={`${inputClasses} pimolu-range-slider__input--min`}

          min={min}
          max={upper}
          step={step}

          value={controlled ? lower : undefined}
          defaultValue={
            controlled ? undefined : initialValue[0]
          }

          name={resolvedNameMin}
          disabled={disabled}
          required={required}

          onChange={handleLowerChange}

          aria-label={lowerName}
          aria-invalid={hasError ? true : ariaInvalid}
          aria-describedby={describedBy}
        />

        <input
          {...props}
          ref={maxRef}
          id={maxId}
          type="range"

          className={`${inputClasses} pimolu-range-slider__input--max`}

          min={lower}
          max={max}
          step={step}

          value={controlled ? upper : undefined}
          defaultValue={
            controlled ? undefined : initialValue[1]
          }

          name={resolvedNameMax}
          disabled={disabled}
          required={required}

          onChange={handleUpperChange}

          aria-label={upperName}
          aria-invalid={hasError ? true : ariaInvalid}
          aria-describedby={describedBy}
        />
      </div>

      {message && (
        <p
          id={messageId}
          className={
            errorMessage
              ? "pimolu-range-slider__error"
              : "pimolu-range-slider__helper"
          }
          role={errorMessage ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
});

RangeSlider.displayName = "PimoluRangeSlider";
