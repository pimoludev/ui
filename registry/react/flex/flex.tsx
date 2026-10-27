"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type CSSProperties,
  type ElementType,
} from "react";

import type {
  PimoluFlexProps,
  PimoluFlexSpace,
} from "./flex.types";

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

function flexSpaceValue(space: PimoluFlexSpace): string {
  const key =
    typeof space === "number"
      ? String(space)
      : SPACE_ALIASES[space];

  const fallback = SPACING_FALLBACK[key] ?? 0;

  return `var(--pimolu-spacing-${key}, ${fallback}px)`;
}

function lengthValue(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

const ALIGN_CLASS: Record<string, string> = {
  start: "pimolu-flex--align-start",
  center: "pimolu-flex--align-center",
  end: "pimolu-flex--align-end",
  stretch: "pimolu-flex--align-stretch",
  baseline: "pimolu-flex--align-baseline",
};

const JUSTIFY_CLASS: Record<string, string> = {
  start: "pimolu-flex--justify-start",
  center: "pimolu-flex--justify-center",
  end: "pimolu-flex--justify-end",
  between: "pimolu-flex--justify-between",
  around: "pimolu-flex--justify-around",
  evenly: "pimolu-flex--justify-evenly",
};

const DIRECTION_CLASS: Record<string, string> = {
  "row-reverse": "pimolu-flex--row-reverse",
  column: "pimolu-flex--column",
  "column-reverse": "pimolu-flex--column-reverse",
};

/* ==================================
   FLEX
================================== */

export const Flex = forwardRef<HTMLElement, PimoluFlexProps>(
  function Flex(
    { classNames,
      as: Tag = "div",
      direction = "row",
      align,
      justify,
      wrap = false,
      gap = 0,
      grow,
      shrink,
      basis,
      fullWidth = false,
      className,
      style: styleProp,
      children,
      ...props
    },
    ref
  ) {
  const [partClasses, scopeParts] = usePartClasses("flex", classNames, true);

    const layoutVars: Record<string, string | number> = {
      "--pimolu-flex-gap": flexSpaceValue(gap),
    };

    if (grow !== undefined) {
      layoutVars["--pimolu-flex-grow"] = grow;
    }

    if (shrink !== undefined) {
      layoutVars["--pimolu-flex-shrink"] = shrink;
    }

    if (basis !== undefined) {
      layoutVars["--pimolu-flex-basis"] = lengthValue(basis);
    }

    const classes = [
      "pimolu-flex",
      DIRECTION_CLASS[direction],
      align && ALIGN_CLASS[align],
      justify && JUSTIFY_CLASS[justify],
      wrap && "pimolu-flex--wrap",
      fullWidth && "pimolu-flex--full-width",
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
        data-direction={direction}
      >
        {children}
      </Component>
    ));
  }
);

Flex.displayName = "PimoluFlex";
