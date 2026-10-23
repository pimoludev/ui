"use client";

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
  {
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

  return (
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
        className={classes}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
});

InputGroup.displayName = "PimoluInputGroup";

export const InputGroupAddon = forwardRef<HTMLSpanElement, PimoluInputGroupAddonProps>(function InputGroupAddon({
  style: motionStyle,
  align = "inline-start",
  className,
  ...props
}, ref) {
  return (
    <span ref={ref} style={motionStyle}
      {...props}
      className={[
        "pimolu-input-group__addon",
        `pimolu-input-group__addon--${align}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
});

InputGroupAddon.displayName = "PimoluInputGroupAddon";

export const InputGroupText = forwardRef<HTMLSpanElement, PimoluInputGroupTextProps>(function InputGroupText({
  style: motionStyle,
  className,
  ...props
}, ref) {
  return (
    <span ref={ref} style={motionStyle}
      {...props}
      className={[
        "pimolu-input-group__text",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
});

InputGroupText.displayName = "PimoluInputGroupText";

export const InputGroupInput = forwardRef<
  HTMLInputElement,
  PimoluInputGroupInputProps
>(function InputGroupInput(
  {
    className,
    disabled,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref
) {
  const group = useContext(InputGroupContext);

  return (
    <input
      {...props}
      ref={ref}
      disabled={disabled || group?.disabled}
      aria-invalid={
        ariaInvalid ??
        (group?.invalid ? true : undefined)
      }
      className={[
        "pimolu-input__control",
        "pimolu-input-group__input",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
});

InputGroupInput.displayName = "PimoluInputGroupInput";

export const InputGroupButton = forwardRef<
  HTMLButtonElement,
  PimoluInputGroupButtonProps
>(function InputGroupButton(
  {
    className,
    type = "button",
    disabled,
    ...props
  },
  ref
) {
  const group = useContext(InputGroupContext);

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || group?.disabled}
      className={[
        "pimolu-input-group__button",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
});

InputGroupButton.displayName =
  "PimoluInputGroupButton";
