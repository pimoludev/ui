"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type {
  PimoluRatingProps,
} from "./rating.types";

function clampRating(value: number, max: number) {
  if (!Number.isFinite(value)) return 0;

  return Math.min(
    Math.max(Math.round(value), 0),
    max
  );
}

function starLabel(value: number) {
  return `${value} star${value === 1 ? "" : "s"}`;
}

/* =========================================
   RATING
========================================= */

export const Rating = forwardRef<
  HTMLDivElement,
  PimoluRatingProps
>(function Rating(
  {
    value,
    defaultValue,
    onValueChange,

    max = 5,
    readOnly = false,
    disabled = false,
    size = "md",
    allowClear = false,

    label,
    getLabel,

    className,

    "aria-label": ariaLabel,

    onMouseLeave,

    ...props
  },
  ref
) {
  const generatedId = useId();
  const labelId = `pimolu-rating-${generatedId}-label`;

  const starCount = Math.max(
    1,
    Math.floor(Number.isFinite(max) ? max : 5)
  );

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(
    () => clampRating(defaultValue ?? 0, starCount)
  );

  const current = isControlled
    ? clampRating(value, starCount)
    : clampRating(internalValue, starCount);

  const [hovered, setHovered] = useState<number | null>(
    null
  );

  const itemRefs = useRef<
    Array<HTMLButtonElement | null>
  >([]);

  const locked = readOnly || disabled;

  const preview = hovered ?? current;

  function commit(next: number) {
    if (locked) return;

    const clamped = clampRating(next, starCount);

    if (clamped === current) return;

    if (!isControlled) {
      setInternalValue(clamped);
    }

    onValueChange?.(clamped);
  }

  function activate(nextValue: number) {
    if (locked) return;

    const next =
      allowClear && nextValue === current
        ? 0
        : clampRating(nextValue, starCount);

    commit(next);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (locked) return;

    const focusedIndex = itemRefs.current.findIndex(
      (item) => item === document.activeElement
    );

    const focusedValue =
      focusedIndex >= 0
        ? focusedIndex + 1
        : current;

    let next: number | null = null;

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowUp"
    ) {
      next =
        current > 0
          ? Math.min(focusedValue + 1, starCount)
          : 1;
    } else if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowDown"
    ) {
      next =
        current > 0
          ? Math.max(focusedValue - 1, 1)
          : 1;
    } else if (event.key === "Home") {
      next = 1;
    } else if (event.key === "End") {
      next = starCount;
    } else if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      activate(focusedValue);

      return;
    } else {
      return;
    }

    event.preventDefault();

    commit(next);

    itemRefs.current[next - 1]?.focus();
  }

  const labelIdToUse = label ? labelId : undefined;

  return (
    <div
      {...props}
      ref={ref}
      role="radiogroup"
      aria-orientation="horizontal"
      aria-labelledby={labelIdToUse}
      aria-label={
        label ? undefined : ariaLabel ?? "Rating"
      }
      aria-readonly={readOnly || undefined}
      aria-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-disabled={disabled || undefined}
      className={[
        "pimolu-rating",
        `pimolu-rating--${size}`,
        readOnly && "pimolu-rating--readonly",
        disabled && "pimolu-rating--disabled",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onKeyDown={handleKeyDown}
      onMouseLeave={(event) => {
        setHovered(null);
        onMouseLeave?.(event);
      }}
    >
      {label && (
        <span
          id={labelId}
          className="pimolu-rating__label"
        >
          {label}
        </span>
      )}

      <div
        className="pimolu-rating__items"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from(
          { length: starCount },
          (_, itemIndex) => {
            const index = itemIndex + 1;

            const checked = current === index;

            const filled = index <= preview;

            const tabStop =
              checked || (current === 0 && index === 1);

            return (
              <button
                key={index}
                ref={(node) => {
                  itemRefs.current[itemIndex] = node;
                }}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={
                  getLabel?.(index) || starLabel(index)
                }
                tabIndex={tabStop ? 0 : -1}
                disabled={disabled}
                data-filled={filled ? "true" : "false"}
                data-rating-value={index}
                className="pimolu-rating__item"
                onClick={() => activate(index)}
                onMouseEnter={() => {
                  if (!locked) setHovered(index);
                }}
              >
                <span
                  className="pimolu-rating__icon"
                  aria-hidden="true"
                >
                  <svg
                    className="pimolu-rating__star"
                    viewBox="0 0 24 24"
                    fill={
                      filled ? "currentColor" : "none"
                    }
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z" />
                  </svg>
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
});

Rating.displayName = "PimoluRating";
