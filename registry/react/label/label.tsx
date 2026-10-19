"use client";

import { forwardRef } from "react";

import type { PimoluLabelProps } from "./label.types";

import { labelVariants } from "./label.variants";

export const Label = forwardRef<
  HTMLLabelElement,
  PimoluLabelProps
>(function Label(
  {
    required = false,
    optional = false,
    optionalLabel = "Optional",
    disabled = false,
    size = "md",
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <label
      {...props}
      ref={ref}
      data-disabled={disabled || undefined}
      className={labelVariants({ size }, className)}
    >
      {children}

      {required && (
        <span
          className="pimolu-label__required"
          aria-hidden="true"
        >
          *
        </span>
      )}

      {optional && (
        <span className="pimolu-label__optional">
          {optionalLabel}
        </span>
      )}
    </label>
  );
});
