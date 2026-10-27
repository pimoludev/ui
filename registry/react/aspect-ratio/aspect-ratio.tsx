"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  type CSSProperties,
  type ElementType,
} from "react";

import type { PimoluAspectRatioProps } from "./aspect-ratio.types";

const DEFAULT_ASPECT_RATIO = 16 / 9;

function isValidRatio(
  ratio: number | undefined
): ratio is number {
  return (
    typeof ratio === "number" &&
    Number.isFinite(ratio) &&
    ratio > 0
  );
}

/* ==================================
   ASPECT RATIO
================================== */

export const AspectRatio = forwardRef<
  HTMLElement,
  PimoluAspectRatioProps
>(function AspectRatio(
  { classNames,
    as: Tag = "div",
    ratio = DEFAULT_ASPECT_RATIO,
    className,
    style: styleProp,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("aspect-ratio", classNames, true);

  const classes = [
    "pimolu-aspect-ratio",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const layoutVars: Record<string, string> = {};

  if (isValidRatio(ratio)) {
    layoutVars["--pimolu-aspect-ratio"] = String(ratio);
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
      data-ratio={
        isValidRatio(ratio) ? ratio : undefined
      }
    >
      <div className={mergeClasses("pimolu-aspect-ratio__content", partClasses.content)}>
        {children}
      </div>
    </Component>
  ));
});

AspectRatio.displayName = "PimoluAspectRatio";
