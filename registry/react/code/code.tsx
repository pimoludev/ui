"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import { forwardRef } from "react";

import type {
  PimoluCodeProps,
  PimoluKbdProps,
} from "./code.types";

import {
  codeVariants,
  kbdVariants,
} from "./code.variants";

export const Code = forwardRef<
  HTMLElement,
  PimoluCodeProps
>(function Code(
  { classNames,
    block = false,
    size = "sm",
    className,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("code", classNames, true);

  if (block) {
    return scopeParts((
      <pre className={mergeClasses("pimolu-code-block", partClasses.root)}>
        <code
          {...props}
          ref={ref}
          className={mergeClasses(codeVariants(
            { size },
            className
          ), partClasses.root)}
        >
          {children}
        </code>
      </pre>
    ));
  }

  return scopeParts((
    <code
      {...props}
      ref={ref}
      className={mergeClasses(codeVariants(
        { size },
        className
      ), partClasses.root)}
    >
      {children}
    </code>
  ));
});

export const Kbd = forwardRef<
  HTMLElement,
  PimoluKbdProps
>(function Kbd(
  { classNames, size = "sm", className, children, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("code", classNames, true);

  return scopeParts((
    <kbd
      {...props}
      ref={ref}
      className={mergeClasses(kbdVariants({ size }, className), partClasses.root)}
    >
      {children}
    </kbd>
  ));
});
