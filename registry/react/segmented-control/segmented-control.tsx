"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
import { useSlidingIndicator } from "../internal/use-sliding-indicator";


import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type { PimoluSegmentedControlProps } from "./segmented-control.types";

import { segmentedControlVariants } from "./segmented-control.variants";

export const SegmentedControl = forwardRef<
  HTMLDivElement,
  PimoluSegmentedControlProps
>(function SegmentedControl(
  { classNames,
    options,

    value: controlledValue,
    defaultValue,
    onValueChange,

    size = "md",
    orientation = "horizontal",
    fullWidth = false,
    disabled = false,
    animated = true,
    scrollable = false,
    showScrollbar = false,

    name,

    className,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("segmented-control", classNames, true);

  const firstEnabled = options.find(
    (option) => !option.disabled
  )?.value;

  const [uncontrolledValue, setUncontrolledValue] =
    useState(defaultValue ?? firstEnabled);

  const isControlled = controlledValue !== undefined;

  const value = isControlled
    ? controlledValue
    : uncontrolledValue;

  const groupRef = useRef<HTMLDivElement | null>(null);
  const indicatorLayout = useMemo(() => ({ value, orientation, size, options, disabled }), [value, orientation, size, options, disabled]);
  const { indicator, ready, visible } = useSlidingIndicator(
    groupRef,
    ':scope > [role="radio"][aria-checked="true"]',
    indicatorLayout,
  );

  useEffect(() => {
    const group = groupRef.current;
    if (!group || !scrollable) return;
    const selected = group.querySelector<HTMLElement>(':scope > [role="radio"][aria-checked="true"]');
    if (!selected) return;
    const groupBox = group.getBoundingClientRect(), box = selected.getBoundingClientRect();
    if (orientation === "vertical") {
      if (box.top < groupBox.top + 4) group.scrollTop -= groupBox.top + 4 - box.top;
      else if (box.bottom > groupBox.bottom - 4) group.scrollTop += box.bottom - groupBox.bottom + 4;
    } else {
      if (box.left < groupBox.left + 4) group.scrollLeft -= groupBox.left + 4 - box.left;
      else if (box.right > groupBox.right - 4) group.scrollLeft += box.right - groupBox.right + 4;
    }
  }, [value, scrollable, orientation, options]);

  /* A late option list still selects its first enabled entry. */

  useEffect(() => {
    if (isControlled) return;

    if (
      options.some(
        (option) =>
          option.value === uncontrolledValue &&
          !option.disabled
      )
    ) {
      return;
    }

    const next = options.find(
      (option) => !option.disabled
    )?.value;

    if (next && next !== uncontrolledValue) {
      setUncontrolledValue(next);
    }
  }, [options, uncontrolledValue, isControlled]);

  function select(next: string) {
    if (disabled) return;
    if (next === value) return;

    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onValueChange?.(next);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (disabled) return;

    const group = groupRef.current;

    if (!group) return;

    const items = Array.from(
      group.querySelectorAll<HTMLButtonElement>(
        '[role="radio"]:not([disabled])'
      )
    );

    if (items.length === 0) return;

    const active =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const index = items.indexOf(
      active as HTMLButtonElement
    );

    const horizontal = orientation === "horizontal";

    let nextIndex: number | null = null;

    if (
      event.key ===
      (horizontal ? "ArrowRight" : "ArrowDown")
    ) {
      nextIndex =
        index < 0 ? 0 : (index + 1) % items.length;
    } else if (
      event.key ===
      (horizontal ? "ArrowLeft" : "ArrowUp")
    ) {
      nextIndex =
        index < 0
          ? items.length - 1
          : (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    const next = items[nextIndex];

    if (!next) return;

    next.focus();

    const nextValue = next.dataset.value;

    if (nextValue) {
      select(nextValue);
    }
  }

  return scopeParts((
    <div
      {...props}
      ref={(node) => {
        groupRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      role="radiogroup"
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      data-animated={animated ? undefined : "false"}
      data-indicator={visible ? "true" : undefined}
      data-scrollable={scrollable ? "true" : undefined}
      data-show-scrollbar={showScrollbar ? "true" : undefined}
      className={mergeClasses([
        segmentedControlVariants({ size }),
        fullWidth &&
          "pimolu-segmented-control--full-width",
        orientation === "vertical" &&
          "pimolu-segmented-control--vertical",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
      onKeyDown={handleKeyDown}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const optionDisabled =
          disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={optionDisabled || undefined}
            tabIndex={selected ? 0 : -1}
            data-state={
              selected ? "active" : "inactive"
            }
            data-value={option.value}
            disabled={optionDisabled}
            className={mergeClasses("pimolu-segmented-control__item", partClasses.item)}
            onClick={() => select(option.value)}
          >
            {option.label}
          </button>
        );
      })}

      {name && (
        <input
          type="hidden"
          name={name}
          value={value ?? ""}
        />
      )}
      <span
        aria-hidden="true"
        className={mergeClasses("pimolu-segmented-control__indicator", partClasses.indicator)}
        data-ready={ready ? "true" : undefined}
        hidden={!visible}
        style={indicator ? {
          transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0)`,
          width: indicator.width,
          height: indicator.height,
        } : undefined}
      />
    </div>
  ));
});
