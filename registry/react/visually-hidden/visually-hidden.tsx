"use client";

import {
  forwardRef,
  type ElementType,
} from "react";

import type { PimoluVisuallyHiddenProps } from "./visually-hidden.types";

export const VisuallyHidden = forwardRef<
  HTMLElement,
  PimoluVisuallyHiddenProps
>(function VisuallyHidden(
  {
    as: Tag = "span",
    focusable = false,
    className,
    tabIndex,
    children,
    ...props
  },
  ref
) {
  const classes = [
    "pimolu-visually-hidden",
    focusable && "pimolu-visually-hidden--focusable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Component = Tag as ElementType;

  return (
    <Component
      {...props}
      ref={ref}
      className={classes}
      tabIndex={focusable ? (tabIndex ?? 0) : tabIndex}
      data-focusable={focusable ? "true" : "false"}
    >
      {children}
    </Component>
  );
});

VisuallyHidden.displayName = "PimoluVisuallyHidden";
