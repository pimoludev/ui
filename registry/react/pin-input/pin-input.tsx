"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

import type {
  PimoluPinInputProps,
  PimoluPinInputType,
} from "./pin-input.types";

/* =========================================
   HELPERS
========================================= */

function sanitize(
  text: string,
  type: PimoluPinInputType
) {
  const pattern =
    type === "numeric"
      ? /\D/g
      : /[^a-z0-9]/gi;

  return text.replace(pattern, "");
}

function sanitizeCell(
  text: string,
  type: PimoluPinInputType
) {
  return sanitize(text, type).slice(-1);
}

function normalizeCells(
  value: string[] | undefined,
  count: number,
  type: PimoluPinInputType
) {
  return Array.from(
    { length: count },
    (_, index) => sanitizeCell(value?.[index] ?? "", type)
  );
}

/* =========================================
   PIN INPUT
========================================= */

export const PinInput = forwardRef<
  HTMLDivElement,
  PimoluPinInputProps
>(function PinInput(
  {
    value,
    defaultValue,
    onValueChange,
    onComplete,

    length = 6,
    type = "numeric",
    mask = false,

    disabled = false,
    readOnly = false,

    error = false,
    helperText,
    errorMessage,

    label,

    autoFocus = false,
    groups,

    className,

    "aria-label": ariaLabel,

    ...props
  },
  forwardedRef
) {
  const generatedId = useId();

  const labelId = `pimolu-pin-input-${generatedId}-label`;

  const hasError = error || Boolean(errorMessage);

  const message = errorMessage ?? helperText;

  const messageId = message
    ? `pimolu-pin-input-${generatedId}-message`
    : undefined;

  const count = Math.max(1, Math.floor(length));

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<
    string[]
  >(() => normalizeCells(defaultValue, count, type));

  const cells = isControlled
    ? normalizeCells(value, count, type)
    : normalizeCells(internalValue, count, type);

  const inputsRef = useRef<
    Array<HTMLInputElement | null>
  >([]);

  const completedRef = useRef(cells.every(Boolean));

  /* Keep the completion latch in sync with controlled resets too. */
  useEffect(() => {
    completedRef.current = cells.every(Boolean);
  }, [cells]);

  const canEdit =
    !disabled &&
    !readOnly &&
    (!isControlled || Boolean(onValueChange));

  /* Focus the first empty cell on mount. */
  useEffect(() => {
    if (!autoFocus || disabled) return;

    const firstEmpty = cells.findIndex((cell) => !cell);
    const node =
      inputsRef.current[
        firstEmpty === -1 ? 0 : firstEmpty
      ];

    node?.focus();
    node?.select();

    /* `cells` is only read for the initial focus. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus, disabled]);

  function focusCell(index: number) {
    const bounded = Math.min(
      Math.max(index, 0),
      count - 1
    );

    const node = inputsRef.current[bounded];

    node?.focus();
    node?.select();
  }

  function commit(next: string[]) {
    const unchanged = next.every(
      (cell, index) => cell === cells[index]
    );

    if (unchanged) return;

    const nextComplete = next.every(Boolean);
    const wasComplete = completedRef.current;

    completedRef.current = nextComplete;

    if (!isControlled) {
      setInternalValue(next);
    }

    onValueChange?.(next);

    if (nextComplete && !wasComplete) {
      onComplete?.(next.join(""));
    }
  }

  function setCell(index: number, char: string) {
    const next = [...cells];

    next[index] = char;

    commit(next);

    if (char && index < count - 1) {
      focusCell(index + 1);
    }
  }

  function distribute(text: string, startIndex: number) {
    const chars = sanitize(text, type).slice(
      0,
      count - startIndex
    );

    if (!chars) return false;

    const next = [...cells];

    chars.split("").forEach((char, offset) => {
      next[startIndex + offset] = char;
    });

    commit(next);

    focusCell(
      Math.min(startIndex + chars.length, count - 1)
    );

    return true;
  }

  function handleChange(
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const raw = event.currentTarget.value;

    if (!canEdit) {
      event.currentTarget.value = cells[index];
      return;
    }

    if (raw.length > 1) {
      if (!distribute(raw, index)) {
        event.currentTarget.value = cells[index];
      }

      return;
    }

    if (raw === "") {
      setCell(index, "");
      return;
    }

    const char = sanitizeCell(raw, type);

    if (!char) {
      event.currentTarget.value = cells[index];
      return;
    }

    setCell(index, char);
  }

  function handleKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.defaultPrevented || disabled) return;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        focusCell(index - 1);
        return;

      case "ArrowRight":
        event.preventDefault();
        focusCell(index + 1);
        return;

      case "Home":
        event.preventDefault();
        focusCell(0);
        return;

      case "End":
        event.preventDefault();
        focusCell(count - 1);
        return;

      default:
        break;
    }

    if (!canEdit) return;

    if (event.key === "Backspace") {
      event.preventDefault();

      if (cells[index]) {
        setCell(index, "");
      } else if (index > 0) {
        const next = [...cells];

        next[index - 1] = "";

        commit(next);
        focusCell(index - 1);
      }

      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();
      setCell(index, "");
    }
  }

  function handlePaste(
    index: number,
    event: ClipboardEvent<HTMLInputElement>
  ) {
    event.preventDefault();

    if (!canEdit) return;

    distribute(
      event.clipboardData.getData("text"),
      index
    );
  }

  const groupSizes =
    groups &&
    groups.length > 0 &&
    groups.every(
      (size) =>
        Number.isInteger(size) && size > 0
    ) &&
    groups.reduce((total, size) => total + size, 0) ===
      count
      ? groups
      : [count];

  let cursor = 0;

  const renderedGroups = groupSizes.map((size) => {
    const start = cursor;

    cursor += size;

    return { start, size };
  });

  const cellType = mask ? "password" : "text";

  const groupName =
    typeof label === "string" || typeof label === "number"
      ? String(label)
      : ariaLabel ?? "One-time code";

  function renderCell(index: number) {
    const cell = cells[index] ?? "";

    return (
      <input
        key={index}
        ref={(node) => {
          inputsRef.current[index] = node;
        }}
        type={cellType}
        className="pimolu-pin-input__cell"
        value={cell}
        onChange={(event) =>
          handleChange(index, event)
        }
        onKeyDown={(event) =>
          handleKeyDown(index, event)
        }
        onPaste={(event) =>
          handlePaste(index, event)
        }
        onFocus={(event) => {
          event.currentTarget.select();
        }}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={1}
        inputMode={
          type === "numeric" ? "numeric" : "text"
        }
        autoComplete={
          index === 0 ? "one-time-code" : "off"
        }
        autoCapitalize={
          type === "alphanumeric"
            ? "characters"
            : undefined
        }
        spellCheck={false}
        aria-label={`${groupName}, digit ${index + 1} of ${count}`}
        aria-invalid={hasError || undefined}
        aria-describedby={messageId}
        data-filled={cell ? "true" : "false"}
      />
    );
  }

  return (
    <div
      {...props}
      ref={forwardedRef}
      role="group"
      aria-labelledby={label ? labelId : undefined}
      aria-label={
        label ? undefined : ariaLabel ?? "One-time code"
      }
      aria-disabled={disabled || undefined}
      className={[
        "pimolu-pin-input",
        disabled && "pimolu-pin-input--disabled",
        readOnly && "pimolu-pin-input--readonly",
        hasError && "pimolu-pin-input--invalid",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <span
          id={labelId}
          className="pimolu-pin-input__label"
        >
          {label}
        </span>
      )}

      <div className="pimolu-pin-input__groups">
        {renderedGroups.map(({ start, size }) => (
          <div
            key={start}
            className="pimolu-pin-input__group"
          >
            {Array.from(
              { length: size },
              (_, offset) => renderCell(start + offset)
            )}
          </div>
        ))}
      </div>

      {message && (
        <p
          id={messageId}
          className={
            hasError
              ? "pimolu-pin-input__error"
              : "pimolu-pin-input__helper"
          }
          role={hasError ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
});

PinInput.displayName = "PimoluPinInput";
