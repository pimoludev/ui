"use client";
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type Key,
  type ReactElement,
  type ReactNode,
  type Ref,
  type UIEvent,
} from "react";

import type {
  PimoluVirtualListProps,
} from "./virtual-list.types";

/* =========================================
   INTERNAL PROPS
========================================= */

interface InternalVirtualListProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"virtual-list">;

  itemHeight: number;
  height: number;
  overscan?: number;
  items?: readonly unknown[];
  itemCount?: number;
  renderItem: (...args: unknown[]) => ReactNode;
  getKey?: (...args: unknown[]) => Key;
}

/* =========================================
   VIRTUAL LIST
========================================= */

function VirtualListComponent(
  { classNames,
    itemHeight,
    height,
    overscan = 3,

    items: rawItems,
    itemCount: rawItemCount,
    renderItem,
    getKey,

    className,
    style,
    onScroll,

    role = "list",
    tabIndex = 0,
    "aria-label": ariaLabel,

    ...props
  }: InternalVirtualListProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const [partClasses, scopeParts] = usePartClasses("virtual-list", classNames, true);

  const [scrollTop, setScrollTop] = useState(0);

  const hasItems = Array.isArray(rawItems);
  const items = hasItems ? rawItems : [];

  const count = hasItems
    ? items.length
    : Math.max(0, rawItemCount ?? 0);

  const safeHeight =
    Number.isFinite(height) && height > 0
      ? height
      : 0;

  const safeItemHeight =
    Number.isFinite(itemHeight) && itemHeight > 0
      ? itemHeight
      : 1;

  const safeOverscan = Math.max(
    0,
    Number.isFinite(overscan)
      ? Math.floor(overscan)
      : 3
  );

  const totalHeight = count * safeItemHeight;

  /* A shrinking list can leave the old scrollTop behind; clamp it so
     the visible window never runs past the last row. */

  const maxScrollTop = Math.max(
    0,
    totalHeight - safeHeight
  );

  const effectiveScrollTop = Math.min(
    Math.max(0, scrollTop),
    maxScrollTop
  );

  const firstVisible = Math.floor(
    effectiveScrollTop / safeItemHeight
  );

  const visibleCount = Math.ceil(
    safeHeight / safeItemHeight
  );

  const start = Math.max(
    0,
    firstVisible - safeOverscan
  );

  const end = Math.min(
    count,
    firstVisible + visibleCount + safeOverscan
  );

  const indexes: number[] = [];

  for (let index = start; index < end; index += 1) {
    indexes.push(index);
  }

  function handleScroll(
    event: UIEvent<HTMLDivElement>
  ) {
    setScrollTop(event.currentTarget.scrollTop);
    onScroll?.(event);
  }

  function renderRow(index: number) {
    return hasItems
      ? renderItem(items[index], index)
      : renderItem(index);
  }

  function rowKey(index: number): Key {
    if (hasItems) {
      return (
        getKey?.(items[index], index) ?? index
      );
    }

    return getKey?.(index) ?? index;
  }

  return scopeParts((
    <div
      {...props}
      ref={forwardedRef}
      role={role}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      className={mergeClasses([
        "pimolu-virtual-list",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
      style={{
        ...style,
        height: safeHeight,
      }}
      data-total-items={count}
      data-item-height={safeItemHeight}
      onScroll={handleScroll}
    >
      <div
        className={mergeClasses("pimolu-virtual-list__spacer", partClasses.spacer)}
        style={{ height: totalHeight }}
        role="presentation"
      >
        {indexes.map((index) => (
          <div
            key={rowKey(index)}
            className={mergeClasses("pimolu-virtual-list__item", partClasses.item)}
            role="listitem"
            data-index={index}
            aria-setsize={count}
            aria-posinset={index + 1}
            style={{
              top: index * safeItemHeight,
              height: safeItemHeight,
            }}
          >
            {renderRow(index)}
          </div>
        ))}
      </div>
    </div>
  ));
}

type VirtualListComponentType = <T>(
  props: PimoluVirtualListProps<T> & {
    ref?: Ref<HTMLDivElement>;
  }
) => ReactElement | null;

export const VirtualList = forwardRef(
  VirtualListComponent
) as unknown as VirtualListComponentType & {
  displayName?: string;
};

VirtualList.displayName = "PimoluVirtualList";
