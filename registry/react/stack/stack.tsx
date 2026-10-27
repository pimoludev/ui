"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type CSSProperties,
  type ElementType,
} from "react";

import type {
  PimoluHStackProps,
  PimoluStackProps,
  PimoluStackSpace,
  PimoluVStackProps,
} from "./stack.types";

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

function stackSpaceValue(space: PimoluStackSpace): string {
  const key =
    typeof space === "number"
      ? String(space)
      : SPACE_ALIASES[space];

  const fallback = SPACING_FALLBACK[key] ?? 0;

  return `var(--pimolu-spacing-${key}, ${fallback}px)`;
}

const ALIGN_CLASS: Record<string, string> = {
  start: "pimolu-stack--align-start",
  center: "pimolu-stack--align-center",
  end: "pimolu-stack--align-end",
  stretch: "pimolu-stack--align-stretch",
  baseline: "pimolu-stack--align-baseline",
};

const JUSTIFY_CLASS: Record<string, string> = {
  start: "pimolu-stack--justify-start",
  center: "pimolu-stack--justify-center",
  end: "pimolu-stack--justify-end",
  between: "pimolu-stack--justify-between",
  around: "pimolu-stack--justify-around",
  evenly: "pimolu-stack--justify-evenly",
};

/* ==================================
   STACK
================================== */

export const Stack = forwardRef<
  HTMLElement,
  PimoluStackProps
>(function Stack(
  { classNames,
    as: Tag = "div",
    direction = "column",
    gap = 3,
    align,
    justify,
    wrap = false,
    fullWidth = false,
    className,
    style: styleProp,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("stack", classNames, true);

  const classes = [
    "pimolu-stack",
    direction === "row" && "pimolu-stack--row",
    align && ALIGN_CLASS[align],
    justify && JUSTIFY_CLASS[justify],
    wrap && "pimolu-stack--wrap",
    fullWidth && "pimolu-stack--full-width",
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
          "--pimolu-stack-gap": stackSpaceValue(gap),
          ...styleProp,
        } as CSSProperties
      }
      data-direction={direction}
    >
      {children}
    </Component>
  ));
});

Stack.displayName = "PimoluStack";

/* ==================================
   HSTACK / VSTACK
================================== */

export const HStack = forwardRef<
  HTMLElement,
  PimoluHStackProps
>(function HStack(props, ref) {
  const [, scopeParts, forwardedParts] = usePartClasses("stack", props.classNames, true);

  return scopeParts((
    <Stack
      {...props}
      ref={ref}
      direction="row" classNames={forwardedParts}
    />
  ));
});

HStack.displayName = "PimoluHStack";

export const VStack = forwardRef<
  HTMLElement,
  PimoluVStackProps
>(function VStack(props, ref) {
  const [, scopeParts, forwardedParts] = usePartClasses("stack", props.classNames, true);

  return scopeParts((
    <Stack
      {...props}
      ref={ref}
      direction="column" classNames={forwardedParts}
    />
  ));
});

VStack.displayName = "PimoluVStack";
