"use client";

import {
  forwardRef,
  useId,
  type ChangeEvent,
} from "react";

import type {
  PimoluSwitchProps,
} from "./switch.types";

import { switchVariants } from "./switch.variants";

export const Switch = forwardRef<
  HTMLInputElement,
  PimoluSwitchProps
>(function Switch(
  {
    id,
    label,
    description,

    size = "md",
    variant = "primary",

    disabled = false,
    required = false,

    onChange,
    onCheckedChange,

    className,
    style,

    "aria-describedby": ariaDescribedBy,

    ...inputProps
  },
  ref
) {
  /* Stable ID for accessibility */

  const generatedId = useId();

  const switchId =
    id ?? `pimolu-switch-${generatedId}`;

  const descriptionId = description
    ? `${switchId}-description`
    : undefined;

  const describedBy = [
    ariaDescribedBy,
    descriptionId,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  /* Native change handler */

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextChecked = event.currentTarget.checked;

    onChange?.(event);
    onCheckedChange?.(nextChecked);
  }

  /* Classes */

  const switchClassName = [
    switchVariants({ size, variant }),

    disabled && "pimolu-switch--disabled",

    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={switchClassName}
      style={style}
    >
      {/* Native switch control */}

      <span className="pimolu-switch__control">
        <input
          {...inputProps}
          ref={ref}
          id={switchId}
          type="checkbox"
          role="switch"
          className="pimolu-switch__input"
          disabled={disabled}
          required={required}
          onChange={handleChange}
          aria-describedby={describedBy}
        />

        <span
          className="pimolu-switch__track"
          aria-hidden="true"
        >
          <span className="pimolu-switch__thumb" />
        </span>
      </span>

      {/* Optional visible text */}

      {(label || description) && (
        <span className="pimolu-switch__content">
          {label && (
            <label
              htmlFor={switchId}
              className="pimolu-switch__label"
            >
              {label}

              {required && (
                <span
                  className="pimolu-switch__required"
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
              className="pimolu-switch__description"
            >
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  );
});

Switch.displayName = "PimoluSwitch";
