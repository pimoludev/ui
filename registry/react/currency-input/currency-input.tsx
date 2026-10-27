"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from "react";

import { useFormReset } from "../internal/use-form-reset";

import type {
  PimoluCurrencyInputProps,
  PimoluCurrencyInputSize,
} from "./currency-input.types";

/* =========================================
   CURRENCY HELPERS
========================================= */

const DEFAULT_LOCALE = "en-US";
const DEFAULT_CURRENCY = "USD";

function finiteOrNull(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

function clampDecimals(value: number) {
  if (!Number.isFinite(value)) return 0;

  return Math.min(Math.max(Math.round(value), 0), 20);
}

function resolveDecimals(
  locale: string,
  currency: string,
  decimals: number | undefined
) {
  if (decimals !== undefined) return clampDecimals(decimals);

  try {
    return clampDecimals(
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).resolvedOptions().maximumFractionDigits ?? 2
    );
  } catch {
    return 2;
  }
}

function decimalSeparatorOf(locale: string) {
  try {
    return (
      new Intl.NumberFormat(locale)
        .formatToParts(1.1)
        .find((part) => part.type === "decimal")?.value ?? "."
    );
  } catch {
    return ".";
  }
}

function roundTo(value: number, decimals: number) {
  return Number(value.toFixed(decimals));
}

/* =========================================
   PARSING
========================================= */

interface ParsedCurrency {
  value: number | null;
  valid: boolean;
}

/**
 * Parses a draft typed by the user or pasted from another app.
 *
 * Currency symbols, letters and spaces are ignored. When both `,` and `.`
 * are present the last one is the decimal separator; a single separator is
 * read with the locale convention, then with the other convention when the
 * digits after it fit the configured precision.
 */
function parseCurrencyValue(
  raw: string,
  decimalSeparator: string,
  decimals: number
): ParsedCurrency {
  const trimmed = raw.trim();

  if (trimmed === "") {
    return { value: null, valid: true };
  }

  let cleaned = trimmed.replace(/[^\d.,+-]/g, "");

  /* Keep at most one leading sign. */
  const negativeSign = cleaned.startsWith("-");

  cleaned = cleaned.replace(/[+-]/g, "");

  if (negativeSign && cleaned !== "") {
    cleaned = `-${cleaned}`;
  }

  if (cleaned === "" || cleaned === "-" || cleaned === "+") {
    return { value: null, valid: false };
  }

  const negative = cleaned.startsWith("-");
  const unsigned = cleaned.replace(/^[+-]/, "");

  if (!unsigned) {
    return { value: null, valid: false };
  }

  const comma = unsigned.lastIndexOf(",");
  const dot = unsigned.lastIndexOf(".");
  const separator = decimalSeparator === "," ? "," : ".";

  let decimalIndex = -1;

  if (comma !== -1 && dot !== -1) {
    /* "1.234,56" and "1,234.56" both work. */
    decimalIndex = Math.max(comma, dot);
  } else if (comma !== -1 || dot !== -1) {
    const char = comma !== -1 ? "," : ".";
    const positions: number[] = [];

    for (let index = 0; index < unsigned.length; index += 1) {
      if (unsigned[index] === char) positions.push(index);
    }

    if (positions.length === 1) {
      const after = unsigned.length - positions[0] - 1;

      if (char === separator) {
        decimalIndex = positions[0];
      } else if (after > 0 && after <= Math.max(decimals, 2)) {
        /* The user typed the decimal separator of another locale. */
        decimalIndex = positions[0];
      }
    }
    /* More than one separator: it is grouping, unless a locale decimal
       separator is present among them, handled above. */
  }

  let normalized = "";

  for (let index = 0; index < unsigned.length; index += 1) {
    const char = unsigned[index];

    if (index === decimalIndex) {
      normalized += ".";
      continue;
    }

    if (char >= "0" && char <= "9") normalized += char;
  }

  if (normalized === "" || normalized === ".") {
    return { value: null, valid: false };
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return { value: null, valid: false };
  }

  return { value: negative ? -parsed : parsed, valid: true };
}

/* =========================================
   CURRENCY INPUT
========================================= */

export const CurrencyInput = forwardRef<
  HTMLInputElement,
  PimoluCurrencyInputProps
>(function CurrencyInput(
  { classNames,
    id,
    value,
    defaultValue,
    onValueChange,

    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    decimals,
    min,
    max,
    allowNegative = false,

    label,
    helperText,
    errorMessage,
    invalid = false,

    size = "md",
    fullWidth = false,

    className,
    containerClassName,

    disabled = false,
    readOnly = false,
    required = false,

    onFocus,
    onBlur,

    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("currency-input", classNames, true);

  const generatedId = useId();
  const inputId = id ?? `pimolu-currency-input-${generatedId}`;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = value !== undefined;

  const resolvedDecimals = resolveDecimals(
    locale,
    currency,
    decimals
  );

  const decimalSeparator = decimalSeparatorOf(locale);

  const formatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: resolvedDecimals,
        maximumFractionDigits: resolvedDecimals,
      });
    } catch {
      return null;
    }
  }, [locale, currency, resolvedDecimals]);

  function formatCurrency(next: number | null) {
    if (next === null) return "";

    if (formatter) return formatter.format(next);

    return `${next.toFixed(resolvedDecimals)} ${currency}`;
  }

  function formatDraft(next: number | null) {
    if (next === null) return "";

    return String(next).replace(".", decimalSeparator);
  }

  const [internalValue, setInternalValue] =
    useState<number | null>(() => finiteOrNull(defaultValue));

  const currentValue = isControlled
    ? finiteOrNull(value)
    : internalValue;

  const [draft, setDraft] = useState(() =>
    formatCurrency(
      finiteOrNull(
        isControlled ? value : defaultValue
      )
    )
  );

  const [focused, setFocused] = useState(false);

  /* Keep the displayed currency in sync when the field is not focused. */
  useEffect(() => {
    if (focused) return;

    setDraft(formatCurrency(currentValue));
    // `formatCurrency` derives from these dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentValue,
    focused,
    locale,
    currency,
    resolvedDecimals,
  ]);

  useFormReset(inputRef, !isControlled, () => {
    const initial = finiteOrNull(defaultValue);

    setInternalValue(initial);
    setDraft(formatCurrency(initial));
  });

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

  function commit(next: number | null) {
    const normalized = finiteOrNull(next);

    if (normalized === currentValue) return;

    if (!isControlled) {
      setInternalValue(normalized);
    }

    onValueChange?.(normalized);
  }

  function clampValue(next: number | null) {
    if (next === null) return null;

    let result = roundTo(next, resolvedDecimals);

    if (!allowNegative) result = Math.max(result, 0);
    if (min !== undefined) result = Math.max(result, min);
    if (max !== undefined) result = Math.min(result, max);

    return roundTo(result, resolvedDecimals);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    if (!disabled && !readOnly) {
      setFocused(true);
      setDraft(formatDraft(currentValue));
    }

    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const parsed = parseCurrencyValue(
      draft,
      decimalSeparator,
      resolvedDecimals
    );

    const parsedValue = parsed.valid
      ? parsed.value
      : currentValue;

    const next = clampValue(
      parsedValue === null || allowNegative
        ? parsedValue
        : Math.abs(parsedValue)
    );

    setFocused(false);
    setDraft(formatCurrency(next));
    commit(next);

    onBlur?.(event);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const raw = event.currentTarget.value;

    setDraft(raw);

    if (disabled || readOnly) return;

    const parsed = parseCurrencyValue(
      raw,
      decimalSeparator,
      resolvedDecimals
    );

    if (!parsed.valid) return;

    /* The sign constraint applies immediately; min/max wait for blur. */
    const next =
      parsed.value === null || allowNegative
        ? parsed.value
        : Math.abs(parsed.value);

    commit(next);
  }

  /* Accessibility */

  const hasError = invalid || Boolean(errorMessage);

  const message = errorMessage ?? helperText;
  const isErrorMessage = Boolean(errorMessage);

  const messageId = message
    ? `${inputId}-message`
    : undefined;

  const describedBy =
    [ariaDescribedBy, messageId]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldClassName = [
    "pimolu-currency-input",
    `pimolu-currency-input--${size as PimoluCurrencyInputSize}`,
    fullWidth && "pimolu-currency-input--full-width",
    hasError && "pimolu-currency-input--invalid",
    disabled && "pimolu-currency-input--disabled",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <div className={mergeClasses(fieldClassName, partClasses.root)}>
      {label && (
        <label
          htmlFor={inputId}
          className={mergeClasses("pimolu-currency-input__label", partClasses.label)}
        >
          {label}

          {required && (
            <span
              className={mergeClasses("pimolu-currency-input__required", partClasses.required)}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className={mergeClasses("pimolu-currency-input__wrapper", partClasses.wrapper)}>
        <input
          {...props}
          ref={setInputRef}
          id={inputId}
          type="text"
          className={mergeClasses([
            "pimolu-currency-input__control",
            className,
          ]
            .filter(Boolean)
            .join(" "), partClasses.control)}
          value={draft}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputMode="decimal"
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={
            hasError ? true : ariaInvalid
          }
          aria-describedby={describedBy}
        />
      </div>

      {message && (
        <p
          id={messageId}
          className={mergeClasses(isErrorMessage
              ? "pimolu-currency-input__error"
              : "pimolu-currency-input__helper", partClasses.error)}
          role={isErrorMessage ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  ));
});

CurrencyInput.displayName = "PimoluCurrencyInput";
