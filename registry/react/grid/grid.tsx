"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type CSSProperties,
  type ElementType,
} from "react";

import type {
  PimoluGridProps,
  PimoluGridSpace,
} from "./grid.types";

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

function gridSpaceValue(space: PimoluGridSpace): string {
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
  start: "pimolu-grid--align-start",
  center: "pimolu-grid--align-center",
  end: "pimolu-grid--align-end",
  stretch: "pimolu-grid--align-stretch",
};

const JUSTIFY_CLASS: Record<string, string> = {
  start: "pimolu-grid--justify-start",
  center: "pimolu-grid--justify-center",
  end: "pimolu-grid--justify-end",
  stretch: "pimolu-grid--justify-stretch",
};

/* ==================================
   GRID
================================== */

export const Grid = forwardRef<HTMLElement, PimoluGridProps>(
  function Grid(
    { classNames,
      as: Tag = "div",
      columns,
      minItemWidth,
      gap = 4,
      align,
      justify,
      fullWidth = false,
      className,
      style: styleProp,
      children,
      ...props
    },
    ref
  ) {
  const [partClasses, scopeParts] = usePartClasses("grid", classNames, true);

    const layoutVars: Record<string, string> = {
      "--pimolu-grid-gap": gridSpaceValue(gap),
    };

    const fixedColumns =
      typeof columns === "number";

    if (fixedColumns) {
      const count =
        Number.isFinite(columns) && columns > 0
          ? Math.max(1, Math.floor(columns))
          : 1;

      layoutVars["--pimolu-grid-columns"] =
        `repeat(${count}, minmax(0, 1fr))`;
    }

    if (!fixedColumns && minItemWidth !== undefined) {
      layoutVars["--pimolu-grid-min-item-width"] =
        lengthValue(minItemWidth);
    }

    const classes = [
      "pimolu-grid",
      columns === "auto-fit" && "pimolu-grid--auto-fit",
      columns === "auto-fill" && "pimolu-grid--auto-fill",
      align && ALIGN_CLASS[align],
      justify && JUSTIFY_CLASS[justify],
      fullWidth && "pimolu-grid--full-width",
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
        data-columns={columns}
      >
        {children}
      </Component>
    ));
  }
);

Grid.displayName = "PimoluGrid";
