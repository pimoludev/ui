"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import type {
  PimoluTimePickerProps,
  PimoluTimePickerSize,
} from "./time-picker.types";

import { Label } from "../label/label";

/* =========================================
   HELPERS
========================================= */

const sizeClass: Record<
  PimoluTimePickerSize,
  string
> = {
  sm: "pimolu-time-picker--sm",
  md: "pimolu-time-picker--md",
  lg: "pimolu-time-picker--lg",
};

function normalizeTime(
  value: string | null | undefined
) {
  return value === undefined ||
    value === null ||
    value === ""
    ? null
    : value;
}

/* =========================================
   TIME PICKER
========================================= */

export const TimePicker = forwardRef<
  HTMLInputElement,
  PimoluTimePickerProps
>(function TimePicker(
  { classNames,
    id,
    value,
    defaultValue,
    onValueChange,

    withSeconds = false,
    min,
    max,
    step,

    size = "md",
    label,
    helperText,
    errorMessage,
    invalid = false,

    clearable = true,
    clearLabel,

    showFormatHint = false,
    formatHint,

    fullWidth = false,

    className,

    disabled,
    readOnly,
    required,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("time-picker", classNames, true);

  const generatedId = useId();
  const inputId =
    id ?? `pimolu-time-picker-${generatedId}`;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<
    string | null
  >(() => normalizeTime(defaultValue));

  const currentValue = isControlled
    ? normalizeTime(value)
    : internalValue;

  const setInputRef = useCallback(
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

  const canChange =
    !disabled &&
    !readOnly &&
    (!isControlled || Boolean(onValueChange));

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const raw = event.currentTarget.value;

    if (!canChange) {
      event.currentTarget.value = currentValue ?? "";
      return;
    }

    const next = normalizeTime(raw);

    if (!isControlled) {
      setInternalValue(next);
    }

    onValueChange?.(next);
  }

  function handleClear() {
    if (!canChange) return;

    if (!isControlled) {
      setInternalValue(null);
    }

    onValueChange?.(null);

    inputRef.current?.focus();
  }

  const hasError =
    invalid || Boolean(errorMessage);

  const message = errorMessage ?? helperText;
  const messageId = message
    ? `${inputId}-message`
    : undefined;

  const hintText =
    formatHint ??
    "The 12- or 24-hour display follows the browser locale.";

  const hintId = showFormatHint
    ? `${inputId}-hint`
    : undefined;

  const describedBy =
    [
      props["aria-describedby"],
      messageId,
      hintId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const resolvedStep =
    step ?? (withSeconds ? 1 : 60);

  const showClear =
    clearable &&
    currentValue !== null &&
    canChange;

  const resolvedClearLabel =
    clearLabel ??
    (typeof label === "string"
      ? `Clear ${label}`
      : "Clear time");

  return scopeParts((
    <div
      className={mergeClasses([
        "pimolu-time-picker",
        sizeClass[size],
        fullWidth && "pimolu-time-picker--full-width",
        hasError && "pimolu-time-picker--invalid",
        disabled && "pimolu-time-picker--disabled",
        readOnly && "pimolu-time-picker--readonly",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
    >
      {label && (
        <Label
          htmlFor={inputId}
          required={required}
          disabled={disabled}
          className={mergeClasses("pimolu-time-picker__label", partClasses.label)}
        >
          {label}
        </Label>
      )}

      <div className={mergeClasses("pimolu-time-picker__wrapper", partClasses.wrapper)}>
        <input
          {...props}
          ref={setInputRef}
          id={inputId}
          type="time"
          className={mergeClasses("pimolu-time-picker__control", partClasses.control)}
          value={currentValue ?? ""}
          min={min}
          max={max}
          step={resolvedStep}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          data-with-seconds={
            withSeconds ? "true" : undefined
          }
          aria-invalid={
            hasError ? true : props["aria-invalid"]
          }
          aria-describedby={describedBy}
        />

        {showClear && (
          <button
            type="button"
            className={mergeClasses("pimolu-time-picker__clear", partClasses.clear)}
            aria-label={resolvedClearLabel}
            onClick={handleClear}
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>

      {showFormatHint && (
        <p
          id={hintId}
          className={mergeClasses("pimolu-time-picker__format-hint", partClasses.formatHint)}
        >
          {hintText}
        </p>
      )}

      {message && (
        <p
          id={messageId}
          className={mergeClasses(hasError
              ? "pimolu-time-picker__error"
              : "pimolu-time-picker__helper", partClasses.error)}
          role={hasError ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  ));
});

TimePicker.displayName = "PimoluTimePicker";
