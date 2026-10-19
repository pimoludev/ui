"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
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

  const lowerRef = useRef<HTMLInputElement | null>(null);
  const upperRef = useRef<HTMLInputElement | null>(null);

  const controlled = value !== undefined;

  const safeStep = step > 0 ? step : 1;

  const [initialValue] = useState<PimoluRangeSliderValue>(
    () => order(defaultValue ?? [min, max], min, max)
  );

  const [internalValue, setInternalValue] =
    useState<PimoluRangeSliderValue>(initialValue);

  const current = controlled
    ? order(value, min, max)
    : internalValue;

  const [lower, upper] = current;

  /* The native reset restores the DOM default; the state follows it. */

  useFormReset(lowerRef, !controlled, () => {
    setInternalValue(initialValue);
  });

  function commit(next: PimoluRangeSliderValue) {
    if (!controlled) {
      setInternalValue(next);
    }

    onValueChange?.(next);
  }

  function snap(raw: number) {
    const steps = Math.round((raw - min) / safeStep);

    return clamp(min + steps * safeStep, min, max);
  }

  /**
   * Moves one handle and keeps the other one untouched. Pass a raw value:
   * it is snapped to the step and clamped against its neighbour.
   */
  function moveHandle(
    handle: "lower" | "upper",
    raw: number
  ) {
    const snapped = snap(raw);

    if (handle === "lower") {
      commit([Math.min(snapped, upper), upper]);
      lowerRef.current?.focus();
    } else {
      commit([lower, Math.max(snapped, lower)]);
      upperRef.current?.focus();
    }
  }

  function handleLowerChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const next = event.currentTarget.valueAsNumber;

    if (!Number.isFinite(next)) return;

    commit([Math.min(snap(next), upper), upper]);
  }

  function handleUpperChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const next = event.currentTarget.valueAsNumber;

    if (!Number.isFinite(next)) return;

    commit([lower, Math.max(snap(next), lower)]);
  }

  /**
   * Click anywhere on the track to move the closest handle, as the
   * established sliders do. Pointer events coming from a thumb are left to
   * the native input, which is already dragging it.
   */
  function handleTrackPointerDown(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (disabled) return;

    if (event.target instanceof HTMLInputElement) return;

    const rect = event.currentTarget.getBoundingClientRect();

    if (rect.width <= 0) return;

    const ratio = clamp(
      (event.clientX - rect.left) / rect.width,
      0,
      1
    );

    const raw = min + ratio * (max - min);

    moveHandle(
      Math.abs(raw - lower) <= Math.abs(raw - upper)
        ? "lower"
        : "upper",
      raw
    );
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
        onPointerDown={handleTrackPointerDown}
      >
        <div
          className="pimolu-range-slider__track"
          aria-hidden="true"
        />

        {/* Both inputs span the full range so their thumbs line up
            with the filled segment; the crossing is prevented by the
            handlers, not by narrowed min/max. */}

        <input
          {...props}
          ref={lowerRef}
          id={minId}
          type="range"

          className={`${inputClasses} pimolu-range-slider__input--min`}

          min={min}
          max={max}
          step={safeStep}

          value={lower}

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
          ref={upperRef}
          id={maxId}
          type="range"

          className={`${inputClasses} pimolu-range-slider__input--max`}

          min={min}
          max={max}
          step={safeStep}

          value={upper}

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
