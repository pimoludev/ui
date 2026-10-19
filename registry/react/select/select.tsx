"use client";

import {
  forwardRef,
  useId,
  type ChangeEvent,
} from "react";

import type {
  PimoluSelectProps,
} from "./select.types";

import { selectVariants } from "./select.variants";

export const Select = forwardRef<
  HTMLSelectElement,
  PimoluSelectProps
>(function Select(
  {
    id,
    children,

    label,
    placeholder,
    helperText,
    errorMessage,
    invalid = false,

    size = "md",
    variant = "neutral",
    appearance = "outline",
    fullWidth = false,

    value,
    defaultValue,

    required = false,
    disabled = false,

    onChange,
    onValueChange,

    className,
    containerClassName,

    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,

    ...nativeProps
  },
  ref
) {
  /* Stable accessible IDs */

  const generatedId = useId();

  const selectId =
    id ?? `pimolu-select-${generatedId}`;

  const hasError =
    invalid || Boolean(errorMessage);

  const message = errorMessage || helperText;

  const messageId = message
    ? `${selectId}-message`
    : undefined;

  const describedBy = [
    ariaDescribedBy,
    messageId,
  ].filter(Boolean).join(" ") || undefined;

  /* Controlled / uncontrolled */

  const isControlled = value !== undefined;

  const initialValue = isControlled
    ? undefined
    : defaultValue ??
      (placeholder !== undefined ? "" : undefined);

  /* Change handler */

  function handleChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const nextValue = event.currentTarget.value;

    onChange?.(event);
    onValueChange?.(nextValue);
  }

  /* Classes */

  const containerClasses = [
    selectVariants({ size, variant, appearance }),

    fullWidth && "pimolu-select--full-width",
    hasError && "pimolu-select--invalid",
    disabled && "pimolu-select--disabled",

    containerClassName,
  ].filter(Boolean).join(" ");

  const controlClasses = [
    "pimolu-select__control",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={selectId}
          className="pimolu-select__label"
        >
          {label}

          {required && (
            <span
              className="pimolu-select__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="pimolu-select__field">
        <select
          {...nativeProps}
          ref={ref}
          id={selectId}
          className={controlClasses}
          value={value}
          defaultValue={initialValue}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          aria-invalid={
            hasError ? true : ariaInvalid
          }
          aria-describedby={describedBy}
        >
          {placeholder !== undefined && (
            <option
              value=""
              disabled={required}
            >
              {placeholder}
            </option>
          )}

          {children}
        </select>

        <span
          className="pimolu-select__chevron"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      {message && (
        <p
          id={messageId}
          className={
            errorMessage
              ? "pimolu-select__error"
              : "pimolu-select__helper"
          }
          role={errorMessage ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
});

Select.displayName = "PimoluSelect";
