"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import type {
  PimoluListItemProps,
  PimoluListProps,
} from "./list.types";

import { listVariants } from "./list.variants";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

export function List({ classNames,
  variant = "divided",
  size = "md",
  children,
  className,
  ...props
}: PimoluListProps) {
  const [partClasses, scopeParts] = usePartClasses("list", classNames, true);

  return scopeParts((
    <ul
      {...props}
      className={mergeClasses(listVariants({ variant, size }, className), partClasses.root)}
    >
      {children}
    </ul>
  ));
}

export function ListItem({ classNames,
  title,
  description,
  start,
  end,
  active = false,
  disabled = false,
  onClick,
  children,
  className,
  ...props
}: PimoluListItemProps) {
  const [partClasses, scopeParts] = usePartClasses("list", classNames, false);

  const content = (
    <>
      {start && (
        <span
          className={mergeClasses("pimolu-list__start", partClasses.start, classNames?.root)}
          aria-hidden="true"
        >
          {start}
        </span>
      )}

      <span className={mergeClasses("pimolu-list__main", partClasses.main, classNames?.root)}>
        {(title || children) && (
          <span className={mergeClasses("pimolu-list__title", partClasses.title)}>
            {title ?? children}
          </span>
        )}

        {description && (
          <span className={mergeClasses("pimolu-list__description", partClasses.description)}>
            {description}
          </span>
        )}
      </span>

      {end && (
        <span className={mergeClasses("pimolu-list__end", partClasses.end, classNames?.root)}>
          {end}
        </span>
      )}
    </>
  );

  return scopeParts((
    <li
      {...props}
      aria-current={active ? "true" : undefined}
      data-state={
        disabled
          ? "disabled"
          : active
            ? "active"
            : "default"
      }
      className={mergeClasses(classes(
        "pimolu-list__item",
        className
      ), partClasses.item, classNames?.root)}
    >
      {onClick ? (
        <button
          type="button"
          className={mergeClasses("pimolu-list__row", partClasses.row)}
          disabled={disabled}
          onClick={onClick}
        >
          {content}
        </button>
      ) : (
        <div className={mergeClasses("pimolu-list__row", partClasses.row)}>
          {content}
        </div>
      )}
    </li>
  ));
}
