"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from "react";

import { useFormReset } from "../internal/use-form-reset";
import { Select } from "../select/select";

import type {
  PimoluPhoneCountry,
  PimoluPhoneInputProps,
  PimoluPhoneInputSize,
} from "./phone-input.types";

/* =========================================
   DEFAULT COUNTRIES
========================================= */

/**
 * Small, dependency-free country list. Consumers can pass their own
 * `countries` array to add, remove or reorder entries.
 */
export const defaultPhoneCountries: PimoluPhoneCountry[] = [
  {
    code: "US",
    name: "United States",
    dialCode: "1",
    pattern: "(999) 999-9999",
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "1",
    pattern: "(999) 999-9999",
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "44",
    pattern: "9999 999999",
  },
  {
    code: "FR",
    name: "France",
    dialCode: "33",
    pattern: "9 99 99 99 99",
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "49",
    pattern: "999 99999999",
  },
  {
    code: "ES",
    name: "Spain",
    dialCode: "34",
    pattern: "999 999 999",
  },
  {
    code: "IT",
    name: "Italy",
    dialCode: "39",
    pattern: "999 999 9999",
  },
  {
    code: "PT",
    name: "Portugal",
    dialCode: "351",
    pattern: "999 999 999",
  },
  {
    code: "NL",
    name: "Netherlands",
    dialCode: "31",
    pattern: "99 999 9999",
  },
  {
    code: "BE",
    name: "Belgium",
    dialCode: "32",
    pattern: "999 99 99 99",
  },
  {
    code: "CH",
    name: "Switzerland",
    dialCode: "41",
    pattern: "99 999 99 99",
  },
  {
    code: "BR",
    name: "Brazil",
    dialCode: "55",
    pattern: "(99) 99999-9999",
  },
  {
    code: "MX",
    name: "Mexico",
    dialCode: "52",
    pattern: "999 999 9999",
  },
  {
    code: "IN",
    name: "India",
    dialCode: "91",
    pattern: "99999 99999",
  },
  {
    code: "JP",
    name: "Japan",
    dialCode: "81",
    pattern: "99-9999-9999",
  },
  {
    code: "AU",
    name: "Australia",
    dialCode: "61",
    pattern: "999 999 999",
  },
  {
    code: "CN",
    name: "China",
    dialCode: "86",
    pattern: "999 9999 9999",
  },
  {
    code: "ZA",
    name: "South Africa",
    dialCode: "27",
    pattern: "99 999 9999",
  },
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "234",
    pattern: "999 999 9999",
  },
];

const FALLBACK_COUNTRY = defaultPhoneCountries[0];

/* =========================================
   PHONE HELPERS
========================================= */

function digitsOf(value: string) {
  return value.replace(/\D/g, "");
}

function formatNational(
  digits: string,
  pattern: string | undefined
) {
  if (!digits) return "";
  if (!pattern) return digits;

  const slots = (pattern.match(/9/g) ?? []).length;

  let output = "";
  let pending = "";
  let index = 0;

  for (const char of pattern) {
    if (char === "9") {
      if (index >= digits.length) break;

      output += pending + digits[index];
      pending = "";
      index += 1;
    } else {
      pending += char;
    }
  }

  /* Keep closing literals only when the pattern is complete. */
  if (index === slots) output += pending;

  /* Digits beyond the pattern are preserved without separators. */
  if (index < digits.length) {
    output += digits.slice(index);
  }

  return output.trimEnd();
}

function caretForDigits(
  formatted: string,
  pattern: string | undefined,
  count: number
) {
  if (count <= 0) return 0;
  if (!pattern) return Math.min(count, formatted.length);

  const slots = (pattern.match(/9/g) ?? []).length;

  /* A complete pattern may end with closing literals: stay after them. */
  if (count >= slots) return formatted.length;

  let position = 0;
  let consumed = 0;

  for (const char of pattern) {
    if (consumed >= count) break;

    position += 1;

    if (char === "9") consumed += 1;
  }

  if (consumed < count) {
    position += count - consumed;
  }

  return Math.min(position, formatted.length);
}

function findCountryByDial(
  international: string,
  countries: PimoluPhoneCountry[]
) {
  const sorted = [...countries].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );

  return sorted.find((country) =>
    international.startsWith(`+${country.dialCode}`)
  );
}

interface ParsedPhone {
  country: PimoluPhoneCountry;
  digits: string;
  international: boolean;
}

function parsePhoneValue(
  raw: string,
  selected: PimoluPhoneCountry,
  countries: PimoluPhoneCountry[]
): ParsedPhone {
  const trimmed = raw.trim();

  if (!trimmed) {
    return {
      country: selected,
      digits: "",
      international: false,
    };
  }

  const compact = trimmed.replace(/[^\d+]/g, "");

  if (compact.startsWith("+")) {
    const international =
      `+${compact.slice(1).replace(/\D/g, "")}`;

    /* Prefer the selected country, so +1 keeps US or Canada as chosen. */
    const selectedPrefix = `+${selected.dialCode}`;

    if (international.startsWith(selectedPrefix)) {
      return {
        country: selected,
        digits: international.slice(
          selectedPrefix.length
        ),
        international: true,
      };
    }

    const match = findCountryByDial(
      international,
      countries
    );

    if (match) {
      return {
        country: match,
        digits: international.slice(
          match.dialCode.length + 1
        ),
        international: true,
      };
    }

    return {
      country: selected,
      digits: international.slice(1),
      international: true,
    };
  }

  return {
    country: selected,
    digits: digitsOf(compact),
    international: false,
  };
}

/* =========================================
   PHONE INPUT
========================================= */

export const PhoneInput = forwardRef<
  HTMLInputElement,
  PimoluPhoneInputProps
>(function PhoneInput(
  {
    id,
    value,
    defaultValue,
    onValueChange,

    country,
    defaultCountry = "US",
    onCountryChange,
    countries,
    countryLabel = "Country",

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
  const generatedId = useId();
  const inputId = id ?? `pimolu-phone-input-${generatedId}`;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const countryList =
    countries && countries.length > 0
      ? countries
      : defaultPhoneCountries;

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(
    () => String(defaultValue ?? "")
  );

  const requestedCountry = country ?? defaultCountry;

  const initialCountry =
    countryList.find(
      (item) => item.code === requestedCountry
    ) ??
    countryList.find(
      (item) => item.code === defaultCountry
    ) ??
    countryList[0] ??
    FALLBACK_COUNTRY;

  const [internalCountry, setInternalCountry] = useState(
    initialCountry.code
  );

  const selectedCountry =
    countryList.find(
      (item) =>
        item.code ===
        (country ?? internalCountry)
    ) ??
    countryList.find(
      (item) => item.code === defaultCountry
    ) ??
    countryList[0] ??
    FALLBACK_COUNTRY;

  const currentValue = isControlled
    ? String(value ?? "")
    : internalValue;

  const parsed = parsePhoneValue(
    currentValue,
    selectedCountry,
    countryList
  );

  const activeCountry = parsed.international
    ? parsed.country
    : selectedCountry;

  const selectorCountry =
    country !== undefined
      ? selectedCountry
      : activeCountry;

  /*
   * The pattern only drives the separators. Numbers longer than the pattern
   * keep their extra digits, and typing is capped at the E.164 maximum.
   */
  const maxDigits = 15;

  const nationalDigits = parsed.digits;

  const displayValue = formatNational(
    nationalDigits,
    activeCountry.pattern
  );

  const pendingCaret = useRef<number | null>(null);

  /* Follow an external E.164 value when the country is not controlled. */
  useEffect(() => {
    if (country !== undefined || !parsed.international) return;

    if (parsed.country.code !== internalCountry) {
      setInternalCountry(parsed.country.code);
    }
  }, [
    country,
    parsed.international,
    parsed.country.code,
    internalCountry,
  ]);

  useFormReset(inputRef, !isControlled, () => {
    setInternalValue(String(defaultValue ?? ""));
    setInternalCountry(initialCountry.code);
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

  useLayoutEffect(() => {
    const pending = pendingCaret.current;

    if (pending === null) return;

    pendingCaret.current = null;

    const input = inputRef.current;

    if (!input || document.activeElement !== input) return;

    const position = Math.max(
      0,
      Math.min(pending, input.value.length)
    );

    input.setSelectionRange(position, position);
  });

  function emit(nextDigits: string, dialCode: string) {
    return nextDigits
      ? `+${dialCode}${nextDigits}`
      : "";
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (disabled || readOnly) return;

    const input = event.currentTarget;
    const raw = input.value;
    const caret = input.selectionStart ?? raw.length;

    const digits = digitsOf(raw).slice(0, maxDigits);

    const formatted = formatNational(
      digits,
      activeCountry.pattern
    );

    pendingCaret.current = caretForDigits(
      formatted,
      activeCountry.pattern,
      Math.min(
        digitsOf(raw.slice(0, caret)).length,
        maxDigits
      )
    );

    const nextValue = emit(
      digits,
      activeCountry.dialCode
    );

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleCountryChange(code: string) {
    const next =
      countryList.find(
        (item) =>
          item.code === code
      ) ?? selectedCountry;

    if (country === undefined) {
      setInternalCountry(next.code);
    }

    const nextValue = emit(
      nationalDigits,
      next.dialCode
    );

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    onCountryChange?.(next);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    onBlur?.(event);
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
    "pimolu-phone-input",
    `pimolu-phone-input--${size as PimoluPhoneInputSize}`,
    fullWidth && "pimolu-phone-input--full-width",
    hasError && "pimolu-phone-input--invalid",
    disabled && "pimolu-phone-input--disabled",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldClassName}>
      {label && (
        <label
          htmlFor={inputId}
          className="pimolu-phone-input__label"
        >
          {label}

          {required && (
            <span
              className="pimolu-phone-input__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="pimolu-phone-input__row">
        <Select
          containerClassName="pimolu-phone-input__country"
          value={selectorCountry.code}
          aria-label={countryLabel}
          onValueChange={handleCountryChange}
          disabled={disabled || readOnly}
        >
          {countryList.map((item) => (
            <option key={item.code} value={item.code}>
              {`${item.name} (+${item.dialCode})`}
            </option>
          ))}
        </Select>

        <div className="pimolu-phone-input__field">
          <span
            className="pimolu-phone-input__dial"
            aria-hidden="true"
          >
            +{activeCountry.dialCode}
          </span>

          <input
            {...props}
            ref={setInputRef}
            id={inputId}
            type="tel"
            className={[
              "pimolu-phone-input__control",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            inputMode="tel"
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={
              hasError ? true : ariaInvalid
            }
            aria-describedby={describedBy}
          />
        </div>
      </div>

      {message && (
        <p
          id={messageId}
          className={
            isErrorMessage
              ? "pimolu-phone-input__error"
              : "pimolu-phone-input__helper"
          }
          role={isErrorMessage ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
});

PhoneInput.displayName = "PimoluPhoneInput";
