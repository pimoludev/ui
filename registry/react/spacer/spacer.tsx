"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type CSSProperties,
  type ElementType,
} from "react";

import type {
  PimoluSpacerProps,
  PimoluSpacerSpace,
} from "./spacer.types";

/* ==================================
   HELPERS
================================== */

const SPACING_FALLBACK: Record<string, number> = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32,
  "10": 40,
  "12": 48,
};

const SPACE_ALIASES: Record<string, string> = {
  none: "0",
  xs: "1",
  sm: "2",
  md: "4",
  lg: "6",
  xl: "8",
  "2xl": "10",
  "3xl": "12",
};

function spacerSpaceValue(space: PimoluSpacerSpace): string {
  const key =
    typeof space === "number"
      ? String(space)
      : SPACE_ALIASES[space];

  const fallback = SPACING_FALLBACK[key] ?? 0;

  return `var(--pimolu-spacing-${key}, ${fallback}px)`;
}

/* ==================================
   SPACER
================================== */

export const Spacer = forwardRef<
  HTMLElement,
  PimoluSpacerProps
>(function Spacer(
  { classNames,
    as: Tag = "div",
    size,
    axis = "both",
    className,
    style: styleProp,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("spacer", classNames, true);

  const fixed = size !== undefined;

  const classes = [
    "pimolu-spacer",
    fixed && "pimolu-spacer--fixed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const layoutVars: Record<string, string> = {};

  if (fixed) {
    layoutVars["--pimolu-spacer-size"] =
      spacerSpaceValue(size);
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
      data-axis={axis}
      aria-hidden="true"
    />
  ));
});

Spacer.displayName = "PimoluSpacer";
