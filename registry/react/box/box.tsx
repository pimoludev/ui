"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type CSSProperties,
  type ElementType,
} from "react";

import type {
  PimoluBoxProps,
  PimoluBoxSpace,
} from "./box.types";

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

/**
 * Turns a scale value into `var(--pimolu-spacing-<n>, <px>)`, the only
 * inline style a layout primitive needs. Everything visual stays in CSS.
 */
function boxSpaceValue(
  space: PimoluBoxSpace
): string {
  const key =
    typeof space === "number"
      ? String(space)
      : SPACE_ALIASES[space];

  const fallback = SPACING_FALLBACK[key] ?? 0;

  return `var(--pimolu-spacing-${key}, ${fallback}px)`;
}

/* ==================================
   BOX
================================== */

export const Box = forwardRef<HTMLElement, PimoluBoxProps>(
  function Box(
    { classNames,
      as: Tag = "div",
      padding,
      p,
      paddingX,
      px,
      paddingY,
      py,
      background = "none",
      fullWidth = false,
      className,
      style: styleProp,
      children,
      ...props
    },
    ref
  ) {
  const [partClasses, scopeParts] = usePartClasses("box", classNames, true);

    const resolvedPadding = padding ?? p;
    const resolvedPaddingX = paddingX ?? px;
    const resolvedPaddingY = paddingY ?? py;

    const layoutVars: Record<string, string> = {};

    if (resolvedPadding !== undefined) {
      layoutVars["--pimolu-box-padding"] =
        boxSpaceValue(resolvedPadding);
    }

    if (resolvedPaddingX !== undefined) {
      layoutVars["--pimolu-box-padding-x"] =
        boxSpaceValue(resolvedPaddingX);
    }

    if (resolvedPaddingY !== undefined) {
      layoutVars["--pimolu-box-padding-y"] =
        boxSpaceValue(resolvedPaddingY);
    }

    const classes = [
      "pimolu-box",
      resolvedPaddingX !== undefined && "pimolu-box--padding-x",
      resolvedPaddingY !== undefined && "pimolu-box--padding-y",
      background !== "none" &&
        `pimolu-box--bg-${background}`,
      fullWidth && "pimolu-box--full-width",
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
        style={
          {
            ...layoutVars,
            ...styleProp,
          } as CSSProperties
        }
      >
        {children}
      </Component>
    ));
  }
);

Box.displayName = "PimoluBox";
