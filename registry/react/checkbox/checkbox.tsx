"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("checkbox", classNames, true);

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

  return scopeParts((
    <div
      className={mergeClasses(checkboxClassName, partClasses.root)}
      style={style}
    >
      <span className={mergeClasses("pimolu-checkbox__control", partClasses.control)}>
        <input
          {...inputProps}
          ref={setInputRef}
          id={checkboxId}
          type="checkbox"
          className={mergeClasses("pimolu-checkbox__input", partClasses.input)}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          aria-describedby={describedBy}
        />

        <span
          className={mergeClasses("pimolu-checkbox__box", partClasses.box)}
          aria-hidden="true"
        >
          <svg
            className={mergeClasses("pimolu-checkbox__check", partClasses.check)}
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
            className={mergeClasses("pimolu-checkbox__minus", partClasses.minus)}
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
        <span className={mergeClasses("pimolu-checkbox__content", partClasses.content)}>
          {label && (
            <label
              htmlFor={checkboxId}
              className={mergeClasses("pimolu-checkbox__label", partClasses.label)}
            >
              {label}

              {required && (
                <span
                  className={mergeClasses("pimolu-checkbox__required", partClasses.required)}
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
              className={mergeClasses("pimolu-checkbox__description", partClasses.description)}
            >
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  ));
});

Checkbox.displayName = "PimoluCheckbox";
