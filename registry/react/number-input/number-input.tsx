"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import type {
  PimoluNumberInputProps,
  PimoluNumberInputSize,
} from "./number-input.types";

/* =========================================
   HELPERS
========================================= */

const sizeClass: Record<PimoluNumberInputSize, string> = {
  sm: "pimolu-number-input--sm",
  md: "pimolu-number-input--md",
  lg: "pimolu-number-input--lg",
};

function clampPrecision(value: number) {
  if (!Number.isFinite(value)) return 0;

  return Math.min(Math.max(Math.round(value), 0), 20);
}

/** Decimals present in the step, so `0.25` keeps two decimals. */
function decimalsOf(value: number) {
  const text = String(value);

  if (text.includes("e-")) {
    const exponent = Number(text.split("e-")[1]);

    return Number.isFinite(exponent) ? clampPrecision(exponent) : 0;
  }

  const dot = text.indexOf(".");

  return dot === -1
    ? 0
    : clampPrecision(text.length - dot - 1);
}

function roundTo(value: number, precision: number) {
  return Number(value.toFixed(precision));
}

function clampTo(
  value: number,
  min: number | undefined,
  max: number | undefined,
  precision: number
) {
  let next = value;

  if (min !== undefined) next = Math.max(next, min);
  if (max !== undefined) next = Math.min(next, max);

  return roundTo(next, precision);
}

function formatNumber(
  value: number | null,
  precision: number
) {
  if (value === null) return "";

  return String(roundTo(value, precision));
}

/**
 * Parses the draft string without clamping, so a partially typed value
 * (a lone minus sign, `1.`, ...) can stay in the field until blur.
 */
function parseNumber(raw: string): {
  empty: boolean;
  value: number | null;
} {
  const trimmed = raw.trim();

  if (trimmed === "") {
    return { empty: true, value: null };
  }

  const normalized = trimmed
    .replace(/\s/g, "")
    .replace(",", ".");

  const parsed = Number(normalized);

  return {
    empty: false,
    value: Number.isFinite(parsed) ? parsed : null,
  };
}

function finiteOrNull(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

/* =========================================
   NUMBER INPUT
========================================= */

export const NumberInput = forwardRef<
  HTMLInputElement,
  PimoluNumberInputProps
>(function NumberInput(
  { classNames,
    id,
    value,
    defaultValue,
    onValueChange,

    min,
    max,
    step = 1,
    precision,
    showSteppers = true,

    size = "md",
    label,
    helperText,
    errorMessage,
    invalid = false,

    prefix,
    suffix,
    fullWidth = false,

    incrementLabel,
    decrementLabel,

    className,

    disabled,
    readOnly,
    required,

    onFocus,
    onBlur,
    onKeyDown,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("number-input", classNames, true);

  const generatedId = useId();
  const inputId = id ?? `pimolu-number-input-${generatedId}`;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] =
    useState<number | null>(() =>
      finiteOrNull(defaultValue)
    );

  const currentValue = isControlled
    ? finiteOrNull(value)
    : internalValue;

  const stepValue =
    Number.isFinite(step) && step > 0 ? step : 1;

  const resolvedPrecision = clampPrecision(
    precision ?? decimalsOf(stepValue)
  );

  const [draft, setDraft] = useState(() =>
    formatNumber(currentValue, resolvedPrecision)
  );

  const [focused, setFocused] = useState(false);

  /* Keep the visible text in sync with external value changes. */
  useEffect(() => {
    if (focused) return;

    setDraft(
      formatNumber(currentValue, resolvedPrecision)
    );
  }, [currentValue, focused, resolvedPrecision]);

  /* Forward the input ref */
  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  const canChangeValue =
    !disabled &&
    !readOnly &&
    (!isControlled || Boolean(onValueChange));

  function commit(next: number | null) {
    if (next === currentValue) return;

    if (!isControlled) {
      setInternalValue(next);
    }

    onValueChange?.(next);
  }

  function applyValue(next: number | null) {
    setDraft(formatNumber(next, resolvedPrecision));
    commit(next);
  }

  function stepBy(direction: 1 | -1, multiplier = 1) {
    if (!canChangeValue) return;

    const base = currentValue ?? min ?? 0;

    const next =
      currentValue === null
        ? clampTo(base, min, max, resolvedPrecision)
        : clampTo(
            base + direction * stepValue * multiplier,
            min,
            max,
            resolvedPrecision
          );

    applyValue(next);

    /* Keep the caret in the field for repeated stepping. */
    inputRef.current?.focus();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.currentTarget.value;

    setDraft(raw);

    if (disabled || readOnly) return;

    const parsed = parseNumber(raw);

    if (parsed.empty) {
      commit(null);
    } else if (parsed.value !== null) {
      commit(
        roundTo(parsed.value, resolvedPrecision)
      );
    }
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    if (!disabled && !readOnly) {
      const parsed = parseNumber(draft);

      const next = parsed.empty
        ? null
        : parsed.value !== null
          ? clampTo(
              parsed.value,
              min,
              max,
              resolvedPrecision
            )
          : currentValue;

      setDraft(
        formatNumber(next, resolvedPrecision)
      );

      commit(next);
    }

    setFocused(false);
    onBlur?.(event);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    onKeyDown?.(event);

    if (event.defaultPrevented || !canChangeValue) {
      return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        stepBy(1);
        break;

      case "ArrowDown":
        event.preventDefault();
        stepBy(-1);
        break;

      case "PageUp":
        event.preventDefault();
        stepBy(1, 10);
        break;

      case "PageDown":
        event.preventDefault();
        stepBy(-1, 10);
        break;

      case "Home":
        if (min === undefined) return;

        event.preventDefault();
        applyValue(
          clampTo(min, min, max, resolvedPrecision)
        );
        break;

      case "End":
        if (max === undefined) return;

        event.preventDefault();
        applyValue(
          clampTo(max, min, max, resolvedPrecision)
        );
        break;

      default:
        break;
    }
  }

  const hasError = invalid || Boolean(errorMessage);

  const message = errorMessage ?? helperText;
  const messageId = message
    ? `${inputId}-message`
    : undefined;

  const describedBy =
    [
      props["aria-describedby"],
      messageId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const atMax =
    max !== undefined &&
    currentValue !== null &&
    currentValue >= max;

  const atMin =
    min !== undefined &&
    currentValue !== null &&
    currentValue <= min;

  const increaseLabel =
    incrementLabel ??
    (typeof label === "string"
      ? `Increase ${label}`
      : "Increase value");

  const decreaseLabel =
    decrementLabel ??
    (typeof label === "string"
      ? `Decrease ${label}`
      : "Decrease value");

  return scopeParts((
    <div
      className={mergeClasses([
        "pimolu-number-input",
        sizeClass[size],
        fullWidth && "pimolu-number-input--full-width",
        hasError && "pimolu-number-input--invalid",
        disabled && "pimolu-number-input--disabled",
        readOnly && "pimolu-number-input--readonly",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={mergeClasses("pimolu-number-input__label", partClasses.label)}
        >
          {label}

          {required && (
            <span
              className={mergeClasses("pimolu-number-input__required", partClasses.required)}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className={mergeClasses("pimolu-number-input__wrapper", partClasses.wrapper)}>
        {prefix !== undefined && (
          <span
            className={mergeClasses("pimolu-number-input__affix pimolu-number-input__affix--prefix", partClasses.affix)}
            aria-hidden="true"
          >
            {prefix}
          </span>
        )}

        <input
          {...props}
          ref={setInputRef}
          id={inputId}
          type="text"
          inputMode={props.inputMode ?? "decimal"}
          autoComplete={props.autoComplete ?? "off"}
          className={mergeClasses("pimolu-number-input__control", partClasses.control)}
          value={draft}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={
            hasError ? true : props["aria-invalid"]
          }
          aria-describedby={describedBy}
        />

        {suffix !== undefined && (
          <span
            className={mergeClasses("pimolu-number-input__affix pimolu-number-input__affix--suffix", partClasses.affix)}
            aria-hidden="true"
          >
            {suffix}
          </span>
        )}

        {showSteppers && (
          <span className={mergeClasses("pimolu-number-input__steppers", partClasses.steppers)}>
            <button
              type="button"
              className={mergeClasses("pimolu-number-input__stepper pimolu-number-input__stepper--up", partClasses.stepper)}
              aria-label={increaseLabel}
              aria-controls={inputId}
              disabled={!canChangeValue || atMax}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => stepBy(1)}
            >
              <svg
                viewBox="0 0 20 20"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m5 12 5-5 5 5" />
              </svg>
            </button>

            <button
              type="button"
              className={mergeClasses("pimolu-number-input__stepper pimolu-number-input__stepper--down", partClasses.stepper)}
              aria-label={decreaseLabel}
              aria-controls={inputId}
              disabled={!canChangeValue || atMin}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => stepBy(-1)}
            >
              <svg
                viewBox="0 0 20 20"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m5 8 5 5 5-5" />
              </svg>
            </button>
          </span>
        )}
      </div>

      {message && (
        <p
          id={messageId}
          className={mergeClasses(hasError
              ? "pimolu-number-input__error"
              : "pimolu-number-input__helper", partClasses.error)}
          role={hasError ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  ));
});

NumberInput.displayName = "PimoluNumberInput";
