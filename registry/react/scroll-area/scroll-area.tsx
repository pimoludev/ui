"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import type { PimoluScrollAreaProps } from "./scroll-area.types";

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

export function ScrollArea({ classNames,
  orientation = "vertical",
  maxHeight,
  viewportClassName,
  children,
  className,
  ...props
}: PimoluScrollAreaProps) {
  const [partClasses, scopeParts] = usePartClasses("scroll-area", classNames, true);

  const {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  } = props;

  return scopeParts((
    <div
      {...rest}
      data-orientation={orientation}
      className={mergeClasses(classes(
        "pimolu-scroll-area",
        className
      ), partClasses.root)}
    >
      <div
        className={mergeClasses(classes(
          "pimolu-scroll-area__viewport",
          viewportClassName
        ), partClasses.viewport)}
        style={{ maxHeight }}
        tabIndex={0}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </div>
    </div>
  ));
}
