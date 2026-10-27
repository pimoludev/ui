"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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

export function DescriptionList({ classNames,
  layout = "stacked",
  variant = "divided",
  size = "md",
  children,
  className,
  ...props
}: PimoluDescriptionListProps) {
  const [partClasses, scopeParts] = usePartClasses("description-list", classNames, true);

  return scopeParts((
    <dl
      {...props}
      className={mergeClasses(descriptionListVariants(
        { layout, variant, size },
        className
      ), partClasses.root)}
    >
      {children}
    </dl>
  ));
}

export function DescriptionItem({ classNames,
  term,
  details,
  className,
}: PimoluDescriptionItemProps) {
  const [partClasses, scopeParts] = usePartClasses("description-list", classNames, false);

  return scopeParts((
    <div
      className={mergeClasses(classes(
        "pimolu-description-list__item",
        className
      ), partClasses.item, classNames?.root)}
    >
      <dt className={mergeClasses("pimolu-description-list__term", partClasses.term)}>
        {term}
      </dt>

      <dd className={mergeClasses("pimolu-description-list__details", partClasses.details)}>
        {details}
      </dd>
    </div>
  ));
}
