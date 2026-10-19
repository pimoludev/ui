"use client";

import {
  forwardRef,
  useEffect,
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
  {
    options,

    value: controlledValue,
    defaultValue,
    onValueChange,

    size = "md",
    orientation = "horizontal",
    fullWidth = false,
    disabled = false,

    name,

    className,
    ...props
  },
  ref
) {
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

  return (
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
      className={[
        segmentedControlVariants({ size }),
        fullWidth &&
          "pimolu-segmented-control--full-width",
        orientation === "vertical" &&
          "pimolu-segmented-control--vertical",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
            className="pimolu-segmented-control__item"
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
    </div>
  );
});
