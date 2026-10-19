"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";

import type {
  PimoluSliderProps,
} from "./slider.types";

import { sliderVariants } from "./slider.variants";

import { useFormReset } from "../internal/use-form-reset";

/* =========================================
   HELPERS
========================================= */

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/* =========================================
   SLIDER
========================================= */

export const Slider = forwardRef<
  HTMLInputElement,
  PimoluSliderProps
>(function Slider(
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

    disabled = false,
    required = false,

    className,
    style,
    containerClassName,
    containerStyle,

    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,

    ...props
  },
  forwardedRef
) {
  const generatedId = useId();
  const sliderId = id ?? `pimolu-slider-${generatedId}`;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const controlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(
    () => Number(defaultValue ?? min)
  );

  const currentValue = controlled
    ? Number(value)
    : internalValue;

  const assignRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  /* Native form reset moves the thumb without React knowing. */

  useFormReset(inputRef, !controlled, () => {
    const restored = inputRef.current?.defaultValue;

    setInternalValue(
      restored === undefined || restored === ""
        ? Number(min)
        : Number(restored)
    );
  });

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextValue = event.currentTarget.valueAsNumber;

    if (!controlled && Number.isFinite(nextValue)) {
      setInternalValue(nextValue);
    }

    if (Number.isFinite(nextValue)) {
      onValueChange?.(nextValue);
    }
  }

  /* Accessibility */

  const hasError =
    invalid || Boolean(errorMessage);

  const message = errorMessage || helperText;

  const messageId = message
    ? `${sliderId}-message`
    : undefined;

  const describedBy = [
    ariaDescribedBy,
    messageId,
  ].filter(Boolean).join(" ") || undefined;

  const displayedValue = formatValue
    ? formatValue(currentValue)
    : String(currentValue);

  /* Fill percentage, exposed to CSS as a custom property. */

  const span = max - min;

  const percent =
    span > 0
      ? clamp(
          ((currentValue - min) / span) * 100,
          0,
          100
        )
      : 0;

  const controlStyle = {
    ...style,
    "--pimolu-slider-progress": `${percent}%`,
  } as CSSProperties;

  /* Classes */

  const containerClasses = [
    sliderVariants({ size, variant }),

    hasError && "pimolu-slider--invalid",
    disabled && "pimolu-slider--disabled",

    containerClassName,
  ].filter(Boolean).join(" ");

  const controlClasses = [
    "pimolu-slider__control",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={containerClasses}
      style={containerStyle}
    >
      {(label || showValue) && (
        <div className="pimolu-slider__header">
          {label && (
            <label
              htmlFor={sliderId}
              className="pimolu-slider__label"
            >
              {label}

              {required && (
                <span
                  className="pimolu-slider__required"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </label>
          )}

          {showValue && (
            /* The native range already announces its value,
               so the visible readout is decorative. */
            <span
              className="pimolu-slider__value"
              aria-hidden="true"
            >
              {displayedValue}
            </span>
          )}
        </div>
      )}

      <input
        {...props}
        ref={assignRef}
        id={sliderId}
        type="range"

        className={controlClasses}
        style={controlStyle}

        min={min}
        max={max}
        step={step}

        value={controlled ? value : undefined}
        defaultValue={
          controlled ? undefined : defaultValue ?? min
        }

        disabled={disabled}
        required={required}

        onChange={handleChange}

        aria-invalid={hasError ? true : ariaInvalid}
        aria-describedby={describedBy}
      />

      {message && (
        <p
          id={messageId}
          className={
            errorMessage
              ? "pimolu-slider__error"
              : "pimolu-slider__helper"
          }
          role={errorMessage ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
});

Slider.displayName = "PimoluSlider";
