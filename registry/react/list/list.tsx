"use client";

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

import { forwardRef } from "react";
export const List = forwardRef<HTMLUListElement, PimoluListProps>(function List({
  style: motionStyle,
  variant = "divided",
  size = "md",
  children,
  className,
  ...props
}, ref) {
  return (
    <ul ref={ref} style={motionStyle}
      {...props}
      className={listVariants({ variant, size }, className)}
    >
      {children}
    </ul>
  );
});

List.displayName = "PimoluList";

export const ListItem = forwardRef<HTMLLIElement, PimoluListItemProps>(function ListItem({
  style: motionStyle,
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
}, ref) {
  const content = (
    <>
      {start && (
        <span
          className="pimolu-list__start"
          aria-hidden="true"
        >
          {start}
        </span>
      )}

      <span className="pimolu-list__main">
        {(title || children) && (
          <span className="pimolu-list__title">
            {title ?? children}
          </span>
        )}

        {description && (
          <span className="pimolu-list__description">
            {description}
          </span>
        )}
      </span>

      {end && (
        <span className="pimolu-list__end">
          {end}
        </span>
      )}
    </>
  );

  return (
    <li ref={ref} style={motionStyle}
      {...props}
      aria-current={active ? "true" : undefined}
      data-state={
        disabled
          ? "disabled"
          : active
            ? "active"
            : "default"
      }
      className={classes(
        "pimolu-list__item",
        className
      )}
    >
      {onClick ? (
        <button
          type="button"
          className="pimolu-list__row"
          disabled={disabled}
          onClick={onClick}
        >
          {content}
        </button>
      ) : (
        <div className="pimolu-list__row">
          {content}
        </div>
      )}
    </li>
  );
});

ListItem.displayName = "PimoluListItem";
