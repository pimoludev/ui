"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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
  { classNames,
    as: Tag = "div",
    size = "md",
    className,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("prose", classNames, true);

  const Component = Tag as ElementType;

  return scopeParts((
    <Component
      {...props}
      ref={ref}
      className={mergeClasses(classes(
        "pimolu-prose",
        `pimolu-prose--${size}`,
        className
      ), partClasses.root)}
    >
      {children}
    </Component>
  ));
});

Prose.displayName = "PimoluProse";
