"use client";

import type {
  PimoluDescriptionItemProps,
  PimoluDescriptionListProps,
} from "./description-list.types";

import { descriptionListVariants } from "./description-list.variants";

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

import { forwardRef } from "react";
export const DescriptionList = forwardRef<HTMLDListElement, PimoluDescriptionListProps>(function DescriptionList({
  style: motionStyle,
  layout = "stacked",
  variant = "divided",
  size = "md",
  children,
  className,
  ...props
}, ref) {
  return (
    <dl ref={ref} style={motionStyle}
      {...props}
      className={descriptionListVariants(
        { layout, variant, size },
        className
      )}
    >
      {children}
    </dl>
  );
});

DescriptionList.displayName = "PimoluDescriptionList";

export const DescriptionItem = forwardRef<HTMLDivElement, PimoluDescriptionItemProps>(function DescriptionItem({
  style: motionStyle,
  term,
  details,
  className,
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      className={classes(
        "pimolu-description-list__item",
        className
      )}
    >
      <dt className="pimolu-description-list__term">
        {term}
      </dt>

      <dd className="pimolu-description-list__details">
        {details}
      </dd>
    </div>
  );
});

DescriptionItem.displayName = "PimoluDescriptionItem";
