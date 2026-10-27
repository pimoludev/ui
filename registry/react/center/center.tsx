"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type CSSProperties,
  type ElementType,
} from "react";

import type { PimoluCenterProps } from "./center.types";

/* ==================================
   HELPERS
================================== */

function lengthValue(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

/* ==================================
   CENTER
================================== */

export const Center = forwardRef<
  HTMLElement,
  PimoluCenterProps
>(function Center(
  { classNames,
    as: Tag = "div",
    inline = false,
    minHeight,
    fullWidth = false,
    className,
    style: styleProp,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("center", classNames, true);

  const classes = [
    "pimolu-center",
    inline && "pimolu-center--inline",
    fullWidth && "pimolu-center--full-width",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const layoutVars: Record<string, string> = {};

  if (minHeight !== undefined) {
    layoutVars["--pimolu-center-min-height"] =
      lengthValue(minHeight);
  }

  const Component = Tag as ElementType;

  return scopeParts((
    <Component
      {...props}
      ref={ref}
      className={mergeClasses(classes, partClasses.root)}
      style={
        {
          ...layoutVars,
          ...styleProp,
        } as CSSProperties
      }
      data-inline={inline ? "true" : "false"}
    >
      {children}
    </Component>
  ));
});

Center.displayName = "PimoluCenter";
