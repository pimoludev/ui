"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import { forwardRef } from "react";

import type { PimoluLabelProps } from "./label.types";

import { labelVariants } from "./label.variants";

export const Label = forwardRef<
  HTMLLabelElement,
  PimoluLabelProps
>(function Label(
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("label", classNames, true);

  return scopeParts((
    <label
      {...props}
      ref={ref}
      data-disabled={disabled || undefined}
      className={mergeClasses(labelVariants({ size }, className), partClasses.root)}
    >
      {children}

      {required && (
        <span
          className={mergeClasses("pimolu-label__required", partClasses.required)}
          aria-hidden="true"
        >
          *
        </span>
      )}

      {optional && (
        <span className={mergeClasses("pimolu-label__optional", partClasses.optional)}>
          {optionalLabel}
        </span>
      )}
    </label>
  ));
});
