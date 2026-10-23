"use client";

import { useState } from "react";

import type { PimoluPaginationProps } from "./pagination.types";

import { paginationVariants } from "./pagination.variants";

type PageItem =
  | number
  | "start-ellipsis"
  | "end-ellipsis";

function getPageItems(
  page: number,
  pageCount: number,
  siblingCount: number
): PageItem[] {
  if (pageCount <= 0) return [];

  const pages = new Set<number>([1, pageCount]);

  for (
    let index = page - siblingCount;
    index <= page + siblingCount;
    index += 1
  ) {
    if (index >= 1 && index <= pageCount) {
      pages.add(index);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);

  const items: PageItem[] = [];

  sorted.forEach((value, index) => {
    const previous = sorted[index - 1];

    if (previous !== undefined && value - previous > 1) {
      items.push(
        previous === 1
          ? "start-ellipsis"
          : "end-ellipsis"
      );
    }

    items.push(value);
  });

  return items;
}

function clamp(page: number, pageCount: number) {
  return Math.min(
    Math.max(page, 1),
    Math.max(pageCount, 1)
  );
}

import { forwardRef } from "react";
export const Pagination = forwardRef<HTMLElement, PimoluPaginationProps>(function Pagination({
  style: motionStyle,
  page: controlledPage,
  defaultPage = 1,
  pageCount,
  onPageChange,
  siblingCount = 1,
  disabled = false,
  previousLabel = "Previous page",
  nextLabel = "Next page",
  size = "md",
  className,
  ...props
}, ref) {
  const [uncontrolledPage, setUncontrolledPage] =
    useState(defaultPage);

  const isControlled = controlledPage !== undefined;

  const current = clamp(
    isControlled ? controlledPage : uncontrolledPage,
    pageCount
  );

  const items = getPageItems(
    current,
    pageCount,
    Math.max(0, siblingCount)
  );

  function goTo(next: number) {
    const page = clamp(next, pageCount);

    if (disabled || page === current) return;

    if (!isControlled) {
      setUncontrolledPage(page);
    }

    onPageChange?.(page);
  }

  return (
    <nav ref={ref} style={motionStyle}
      {...props}
      aria-label={props["aria-label"] ?? "Pagination"}
      className={paginationVariants(
        { size },
        className
      )}
    >
      <ul className="pimolu-pagination__list">
        <li>
          <button
            type="button"
            className="pimolu-pagination__button pimolu-pagination__arrow"
            aria-label={previousLabel}
            disabled={disabled || current <= 1}
            onClick={() => goTo(current - 1)}
          >
            ‹
          </button>
        </li>

        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                className="pimolu-pagination__button"
                aria-label={`Page ${item}`}
                aria-current={
                  item === current ? "page" : undefined
                }
                disabled={disabled}
                data-state={
                  item === current
                    ? "active"
                    : "inactive"
                }
                onClick={() => goTo(item)}
              >
                {item}
              </button>
            </li>
          ) : (
            <li
              key={item}
              aria-hidden="true"
              className="pimolu-pagination__ellipsis"
            >
              …
            </li>
          )
        )}

        <li>
          <button
            type="button"
            className="pimolu-pagination__button pimolu-pagination__arrow"
            aria-label={nextLabel}
            disabled={
              disabled || current >= pageCount
            }
            onClick={() => goTo(current + 1)}
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
});

Pagination.displayName = "PimoluPagination";
