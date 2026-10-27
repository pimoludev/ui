"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("switch", classNames, true);

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

  return scopeParts((
    <div
      className={mergeClasses(switchClassName, partClasses.root)}
      style={style}
    >
      {/* Native switch control */}

      <span className={mergeClasses("pimolu-switch__control", partClasses.control)}>
        <input
          {...inputProps}
          ref={ref}
          id={switchId}
          type="checkbox"
          role="switch"
          className={mergeClasses("pimolu-switch__input", partClasses.input)}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          aria-describedby={describedBy}
        />

        <span
          className={mergeClasses("pimolu-switch__track", partClasses.track)}
          aria-hidden="true"
        >
          <span className={mergeClasses("pimolu-switch__thumb", partClasses.thumb)} />
        </span>
      </span>

      {/* Optional visible text */}

      {(label || description) && (
        <span className={mergeClasses("pimolu-switch__content", partClasses.content)}>
          {label && (
            <label
              htmlFor={switchId}
              className={mergeClasses("pimolu-switch__label", partClasses.label)}
            >
              {label}

              {required && (
                <span
                  className={mergeClasses("pimolu-switch__required", partClasses.required)}
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
              className={mergeClasses("pimolu-switch__description", partClasses.description)}
            >
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  ));
});

Switch.displayName = "PimoluSwitch";
