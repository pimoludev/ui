"use client";

import type { PimoluScrollAreaProps } from "./scroll-area.types";

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

import { forwardRef } from "react";
export const ScrollArea = forwardRef<HTMLDivElement, PimoluScrollAreaProps>(function ScrollArea({
  style: motionStyle,
  orientation = "vertical",
  maxHeight,
  viewportClassName,
  children,
  className,
  ...props
}, ref) {
  const {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  } = props;

  return (
    <div ref={ref} style={motionStyle}
      {...rest}
      data-orientation={orientation}
      className={classes(
        "pimolu-scroll-area",
        className
      )}
    >
      <div
        className={classes(
          "pimolu-scroll-area__viewport",
          viewportClassName
        )}
        style={{ maxHeight }}
        tabIndex={0}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </div>
    </div>
  );
});

ScrollArea.displayName = "PimoluScrollArea";
