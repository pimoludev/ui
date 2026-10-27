"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  createContext,
  forwardRef,
  useContext,
} from "react";

import type {
  PimoluInputGroupAddonProps,
  PimoluInputGroupButtonProps,
  PimoluInputGroupInputProps,
  PimoluInputGroupProps,
  PimoluInputGroupTextProps,
} from "./input-group.types";

interface InputGroupContextValue {
  disabled: boolean;
  invalid: boolean;
}

const InputGroupContext =
  createContext<InputGroupContextValue | null>(null);

export const InputGroup = forwardRef<
  HTMLDivElement,
  PimoluInputGroupProps
>(function InputGroup(
  { classNames,
    children,
    orientation = "horizontal",
    size = "md",
    disabled = false,
    invalid = false,
    fullWidth = false,
    className,
    role = "group",
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("input-group", classNames, true);

  const classes = [
    "pimolu-input-group",
    `pimolu-input-group--${orientation}`,
    `pimolu-input--${size}`,
    fullWidth && "pimolu-input-group--full-width",
    disabled && "pimolu-input-group--disabled",
    invalid && "pimolu-input-group--invalid",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <InputGroupContext.Provider
      value={{ disabled, invalid }}
    >
      <div
        {...props}
        ref={ref}
        role={role}
        aria-disabled={disabled || undefined}
        data-orientation={orientation}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={invalid ? "true" : undefined}
        className={mergeClasses(classes, partClasses.root)}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  ));
});

InputGroup.displayName = "PimoluInputGroup";

export function InputGroupAddon({ classNames,
  align = "inline-start",
  className,
  ...props
}: PimoluInputGroupAddonProps) {
  const [partClasses, scopeParts] = usePartClasses("input-group", classNames, false);

  return scopeParts((
    <span
      {...props}
      className={mergeClasses([
        "pimolu-input-group__addon",
        `pimolu-input-group__addon--${align}`,
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.addon, classNames?.root)}
    />
  ));
}

InputGroupAddon.displayName = "PimoluInputGroupAddon";

export function InputGroupText({ classNames,
  className,
  ...props
}: PimoluInputGroupTextProps) {
  const [partClasses, scopeParts] = usePartClasses("input-group", classNames, false);

  return scopeParts((
    <span
      {...props}
      className={mergeClasses([
        "pimolu-input-group__text",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.text, classNames?.root)}
    />
  ));
}

InputGroupText.displayName = "PimoluInputGroupText";

export const InputGroupInput = forwardRef<
  HTMLInputElement,
  PimoluInputGroupInputProps
>(function InputGroupInput(
  { classNames,
    className,
    disabled,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("input-group", classNames, false);

  const group = useContext(InputGroupContext);

  return scopeParts((
    <input
      {...props}
      ref={ref}
      disabled={disabled || group?.disabled}
      aria-invalid={
        ariaInvalid ??
        (group?.invalid ? true : undefined)
      }
      className={mergeClasses([
        "pimolu-input__control",
        "pimolu-input-group__input",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.control, classNames?.root)}
    />
  ));
});

InputGroupInput.displayName = "PimoluInputGroupInput";

export const InputGroupButton = forwardRef<
  HTMLButtonElement,
  PimoluInputGroupButtonProps
>(function InputGroupButton(
  { classNames,
    className,
    type = "button",
    disabled,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("input-group", classNames, false);

  const group = useContext(InputGroupContext);

  return scopeParts((
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || group?.disabled}
      className={mergeClasses([
        "pimolu-input-group__button",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.button, classNames?.root)}
    />
  ));
});

InputGroupButton.displayName =
  "PimoluInputGroupButton";
