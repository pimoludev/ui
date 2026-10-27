"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type ElementType,
} from "react";

import type { PimoluVisuallyHiddenProps } from "./visually-hidden.types";

export const VisuallyHidden = forwardRef<
  HTMLElement,
  PimoluVisuallyHiddenProps
>(function VisuallyHidden(
  { classNames,
    as: Tag = "span",
    focusable = false,
    className,
    tabIndex,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("visually-hidden", classNames, true);

  const classes = [
    "pimolu-visually-hidden",
    focusable && "pimolu-visually-hidden--focusable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Component = Tag as ElementType;

  return scopeParts((
    <Component
      {...props}
      ref={ref}
      className={mergeClasses(classes, partClasses.root)}
      tabIndex={focusable ? (tabIndex ?? 0) : tabIndex}
      data-focusable={focusable ? "true" : "false"}
    >
      {children}
    </Component>
  ));
});

VisuallyHidden.displayName = "PimoluVisuallyHidden";
