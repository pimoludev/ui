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

export function DescriptionList({
  layout = "stacked",
  variant = "divided",
  size = "md",
  children,
  className,
  ...props
}: PimoluDescriptionListProps) {
  return (
    <dl
      {...props}
      className={descriptionListVariants(
        { layout, variant, size },
        className
      )}
    >
      {children}
    </dl>
  );
}

export function DescriptionItem({
  term,
  details,
  className,
}: PimoluDescriptionItemProps) {
  return (
    <div
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
}
