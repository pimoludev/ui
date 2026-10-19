"use client";

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
  {
    block = false,
    size = "sm",
    className,
    children,
    ...props
  },
  ref
) {
  if (block) {
    return (
      <pre className="pimolu-code-block">
        <code
          {...props}
          ref={ref}
          className={codeVariants(
            { size },
            className
          )}
        >
          {children}
        </code>
      </pre>
    );
  }

  return (
    <code
      {...props}
      ref={ref}
      className={codeVariants(
        { size },
        className
      )}
    >
      {children}
    </code>
  );
});

export const Kbd = forwardRef<
  HTMLElement,
  PimoluKbdProps
>(function Kbd(
  { size = "sm", className, children, ...props },
  ref
) {
  return (
    <kbd
      {...props}
      ref={ref}
      className={kbdVariants({ size }, className)}
    >
      {children}
    </kbd>
  );
});
