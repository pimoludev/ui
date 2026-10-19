"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  type ChangeEvent,
} from "react";

import type {
  PimoluCheckboxProps,
} from "./checkbox.types";

import { checkboxVariants } from "./checkbox.variants";

export const Checkbox = forwardRef<
  HTMLInputElement,
  PimoluCheckboxProps
>(function Checkbox(
  {
    id,
    label,
    description,

    size = "md",
    variant = "primary",

    indeterminate = false,
    disabled = false,
    required = false,

    onChange,
    onCheckedChange,

    className,
    style,

    "aria-describedby": ariaDescribedBy,

    ...inputProps
  },
  forwardedRef
) {
  const generatedId = useId();

  const checkboxId =
    id ?? `pimolu-checkbox-${generatedId}`;

  const descriptionId = description
    ? `${checkboxId}-description`
    : undefined;

  const describedBy = [
    ariaDescribedBy,
    descriptionId,
  ].filter(Boolean).join(" ") || undefined;

  const inputRef = useRef<HTMLInputElement | null>(null);

  /* Synchronize the native mixed state */

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;

      if (node) {
        node.indeterminate = indeterminate;
      }

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef, indeterminate]
  );

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextChecked = event.currentTarget.checked;

    onChange?.(event);
    onCheckedChange?.(nextChecked);
  }

  const checkboxClassName = [
    checkboxVariants({ size, variant }),
    disabled && "pimolu-checkbox--disabled",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={checkboxClassName}
      style={style}
    >
      <span className="pimolu-checkbox__control">
        <input
          {...inputProps}
          ref={setInputRef}
          id={checkboxId}
          type="checkbox"
          className="pimolu-checkbox__input"
          disabled={disabled}
          required={required}
          onChange={handleChange}
          aria-describedby={describedBy}
        />

        <span
          className="pimolu-checkbox__box"
          aria-hidden="true"
        >
          <svg
            className="pimolu-checkbox__check"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 10L8 14L16 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <svg
            className="pimolu-checkbox__minus"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 10H16"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>

      {(label || description) && (
        <span className="pimolu-checkbox__content">
          {label && (
            <label
              htmlFor={checkboxId}
              className="pimolu-checkbox__label"
            >
              {label}

              {required && (
                <span
                  className="pimolu-checkbox__required"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </label>
          )}

          {description && (
            <span
              id={descriptionId}
              className="pimolu-checkbox__description"
            >
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = "PimoluCheckbox";
