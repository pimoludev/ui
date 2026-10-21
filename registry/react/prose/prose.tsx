"use client";

import {
  forwardRef,
  type ElementType,
} from "react";

import type { PimoluProseProps } from "./prose.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

export const Prose = forwardRef<
  HTMLElement,
  PimoluProseProps
>(function Prose(
  {
    as: Tag = "div",
    size = "md",
    className,
    children,
    ...props
  },
  ref
) {
  const Component = Tag as ElementType;

  return (
    <Component
      {...props}
      ref={ref}
      className={classes(
        "pimolu-prose",
        `pimolu-prose--${size}`,
        className
      )}
    >
      {children}
    </Component>
  );
});

Prose.displayName = "PimoluProse";
