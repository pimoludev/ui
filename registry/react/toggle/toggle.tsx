"use client";

import {
  forwardRef,
  useState,
  type MouseEvent,
} from "react";

import type { PimoluToggleProps } from "./toggle.types";

import { toggleVariants } from "./toggle.variants";

export const Toggle = forwardRef<
  HTMLButtonElement,
  PimoluToggleProps
>(function Toggle(
  {
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,

    variant = "default",
    size = "md",

    disabled = false,
    className,

    type = "button",
    onClick,
    children,
    ...props
  },
  ref
) {
  const isControlled = controlledPressed !== undefined;

  const [uncontrolledPressed, setUncontrolledPressed] =
    useState(defaultPressed);

  const pressed = isControlled
    ? controlledPressed
    : uncontrolledPressed;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (event.defaultPrevented || disabled) return;

    const next = !pressed;

    if (!isControlled) {
      setUncontrolledPressed(next);
    }

    onPressedChange?.(next);
  }

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      className={toggleVariants(
        { variant, size },
        className
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});
