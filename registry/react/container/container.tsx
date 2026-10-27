"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type CSSProperties,
  type ElementType,
} from "react";

import type {
  PimoluContainerProps,
  PimoluContainerSpace,
} from "./container.types";

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

function containerSpaceValue(
  space: PimoluContainerSpace
): string {
  const key =
    typeof space === "number"
      ? String(space)
      : SPACE_ALIASES[space];

  const fallback = SPACING_FALLBACK[key] ?? 0;

  return `var(--pimolu-spacing-${key}, ${fallback}px)`;
}

/* ==================================
   CONTAINER
================================== */

export const Container = forwardRef<
  HTMLElement,
  PimoluContainerProps
>(function Container(
  { classNames,
    as: Tag = "div",
    maxWidth = "lg",
    padding = 4,
    centered = true,
    className,
    style: styleProp,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("container", classNames, true);

  const classes = [
    "pimolu-container",
    `pimolu-container--${maxWidth}`,
    !centered && "pimolu-container--start",
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
          "--pimolu-container-padding":
            containerSpaceValue(padding),
          ...styleProp,
        } as CSSProperties
      }
      data-max-width={maxWidth}
    >
      {children}
    </Component>
  ));
});

Container.displayName = "PimoluContainer";
