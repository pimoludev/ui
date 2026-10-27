"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from "react";

import { useFormReset } from "../internal/use-form-reset";

import type {
  PimoluMaskedInputProps,
  PimoluMaskedInputSize,
} from "./masked-input.types";

/* =========================================
   MASK ENGINE
========================================= */

interface MaskToken {
  literal: boolean;
  char: string;
  pattern?: RegExp;
}

function tokenPattern(char: string): RegExp | undefined {
  switch (char) {
    case "9":
      return /[0-9]/;
    case "a":
      return /\p{L}/u;
    case "*":
      return /[\p{L}\p{N}]/u;
    default:
      return undefined;
  }
}

function parseMask(mask: string): MaskToken[] {
  const tokens: MaskToken[] = [];

  for (let index = 0; index < mask.length; index += 1) {
    const char = mask[index];

    /* `\` escapes the next character as a literal. */
    if (char === "\\" && index + 1 < mask.length) {
      index += 1;
      tokens.push({ literal: true, char: mask[index] });
      continue;
    }

    const pattern = tokenPattern(char);

    tokens.push(
      pattern
        ? { literal: false, char, pattern }
        : { literal: true, char }
    );
  }

  return tokens;
}

function totalSlots(tokens: MaskToken[]) {
  return tokens.reduce(
    (count, token) => (token.literal ? count : count + 1),
    0
  );
}

/** Keep only the characters accepted by the next available slot. */
function collectSlots(raw: string, tokens: MaskToken[]) {
  let values = "";
  let tokenIndex = 0;

  for (const char of raw) {
    while (
      tokenIndex < tokens.length &&
      tokens[tokenIndex].literal
    ) {
      tokenIndex += 1;
    }

    if (tokenIndex >= tokens.length) break;

    if (tokens[tokenIndex].pattern?.test(char)) {
      values += char;
      tokenIndex += 1;
    }
  }

  return values;
}

/**
 * Insert the literals between the accepted characters. Literals that follow
 * the last accepted character are only kept when the whole mask is filled,
 * so a partial value never ends with a dangling separator.
 */
function formatSlots(values: string, tokens: MaskToken[]) {
  if (!values) return "";

  const slots = totalSlots(tokens);

  let output = "";
  let pending = "";
  let valueIndex = 0;

  for (const token of tokens) {
    if (token.literal) {
      pending += token.char;
      continue;
    }

    if (valueIndex >= values.length) break;

    output += pending + values[valueIndex];
    pending = "";
    valueIndex += 1;
  }

  if (valueIndex === slots) {
    output += pending;
  }

  return output.trimEnd();
}

function countSlotsBefore(
  raw: string,
  tokens: MaskToken[]
) {
  let count = 0;
  let tokenIndex = 0;

  for (const char of raw) {
    while (
      tokenIndex < tokens.length &&
      tokens[tokenIndex].literal
    ) {
      tokenIndex += 1;
    }

    if (tokenIndex >= tokens.length) break;

    if (tokens[tokenIndex].pattern?.test(char)) {
      count += 1;
      tokenIndex += 1;
    }
  }

  return count;
}

function caretForSlots(
  formatted: string,
  slotCount: number,
  tokens: MaskToken[]
) {
  if (slotCount <= 0) return 0;

  /* A complete mask may end with closing literals: stay after them. */
  if (slotCount >= totalSlots(tokens)) {
    return formatted.length;
  }

  let position = 0;
  let consumed = 0;

  for (const token of tokens) {
    if (consumed >= slotCount) break;

    position += 1;

    if (!token.literal) consumed += 1;
  }

  return Math.min(position, formatted.length);
}

/* =========================================
   MASKED INPUT
========================================= */

export const MaskedInput = forwardRef<
  HTMLInputElement,
  PimoluMaskedInputProps
>(function MaskedInput(
  { classNames,
    id,
    mask,
    value,
    defaultValue,
    onValueChange,

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

    inputMode,
    onFocus,
    onBlur,

    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("masked-input", classNames, true);

  const generatedId = useId();
  const inputId = id ?? `pimolu-masked-input-${generatedId}`;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const tokens = parseMask(mask);

  const format = useCallback(
    (raw: string) =>
      formatSlots(collectSlots(raw, tokens), tokens),
    // The mask string is the only meaningful input here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mask]
  );

  const isControlled = value !== undefined;

  const [localValue, setLocalValue] = useState(() =>
    format(String(defaultValue ?? ""))
  );

  const displayValue = isControlled
    ? format(String(value ?? ""))
    : localValue;

  const pendingCaret = useRef<number | null>(null);

  /* Native form reset restores defaultValue in uncontrolled mode. */
  useFormReset(inputRef, !isControlled, () => {
    setLocalValue(format(String(defaultValue ?? "")));
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

  /* Restore the caret after React applies the formatted value. */
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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const raw = input.value;
    const caret = input.selectionStart ?? raw.length;

    const formatted = format(raw);

    pendingCaret.current = caretForSlots(
      formatted,
      countSlotsBefore(raw.slice(0, caret), tokens),
      tokens
    );

    if (formatted === displayValue) return;

    if (!isControlled) {
      setLocalValue(formatted);
    }

    onValueChange?.(formatted);
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

  const defaultInputMode = tokens.some(
    (token) =>
      !token.literal &&
      (token.char === "a" || token.char === "*")
  )
    ? "text"
    : "numeric";

  const fieldClassName = [
    "pimolu-masked-input",
    `pimolu-masked-input--${size as PimoluMaskedInputSize}`,
    fullWidth && "pimolu-masked-input--full-width",
    hasError && "pimolu-masked-input--invalid",
    disabled && "pimolu-masked-input--disabled",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <div className={mergeClasses(fieldClassName, partClasses.root)}>
      {label && (
        <label
          htmlFor={inputId}
          className={mergeClasses("pimolu-masked-input__label", partClasses.label)}
        >
          {label}

          {required && (
            <span
              className={mergeClasses("pimolu-masked-input__required", partClasses.required)}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className={mergeClasses("pimolu-masked-input__wrapper", partClasses.wrapper)}>
        <input
          {...props}
          ref={setInputRef}
          id={inputId}
          type="text"
          className={mergeClasses([
            "pimolu-masked-input__control",
            className,
          ]
            .filter(Boolean)
            .join(" "), partClasses.control)}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputMode={inputMode ?? defaultInputMode}
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
              ? "pimolu-masked-input__error"
              : "pimolu-masked-input__helper", partClasses.error)}
          role={isErrorMessage ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  ));
});

MaskedInput.displayName = "PimoluMaskedInput";
