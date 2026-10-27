"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import type {
  PimoluTextareaProps,
} from "./textarea.types";

import { textareaVariants } from "./textarea.variants";

import { useFormReset } from "../internal/use-form-reset";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  PimoluTextareaProps
>(function Textarea(
  { classNames,
    id,
    label,
    helperText,
    errorMessage,
    invalid = false,

    size = "md",
    variant = "neutral",
    appearance = "outline",
    resize = "vertical",

    rows = 4,
    fullWidth = false,
    showCount = false,

    value,
    defaultValue,
    maxLength,

    required = false,
    disabled = false,
    readOnly = false,

    onChange,
    onValueChange,

    className,
    containerClassName,

    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("textarea", classNames, true);

  const generatedId = useId();
  const textareaId =
    id ?? `pimolu-textarea-${generatedId}`;

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  /* Controlled / uncontrolled mode */

  const isControlled = value !== undefined;

  const [localValue, setLocalValue] = useState(
    () => String(defaultValue ?? "")
  );

  const currentValue = isControlled
    ? String(value ?? "")
    : localValue;

  /* Native form reset synchronization */

  useFormReset(textareaRef, !isControlled, () => {
    setLocalValue(
      textareaRef.current?.defaultValue ?? ""
    );
  });

  /* Ref forwarding */

  function setTextareaRef(
    node: HTMLTextAreaElement | null
  ) {
    textareaRef.current = node;

    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  }

  /* Changes */

  function handleChange(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    const nextValue = event.currentTarget.value;

    if (!isControlled) {
      setLocalValue(nextValue);
    }

    onChange?.(event);
    onValueChange?.(nextValue);
  }

  /* Accessibility */

  const hasError =
    invalid || Boolean(errorMessage);

  const message = errorMessage || helperText;
  const isErrorMessage = Boolean(errorMessage);

  const messageId = message
    ? `${textareaId}-message`
    : undefined;

  const counterId = showCount
    ? `${textareaId}-counter`
    : undefined;

  const describedBy = [
    ariaDescribedBy,
    messageId,
    counterId,
  ].filter(Boolean).join(" ") || undefined;

  const count = currentValue.length;

  /* Classes */

  const containerClasses = [
    textareaVariants({ size, variant, appearance, resize }),

    fullWidth && "pimolu-textarea--full-width",
    hasError && "pimolu-textarea--invalid",
    disabled && "pimolu-textarea--disabled",
    readOnly && "pimolu-textarea--readonly",

    containerClassName,
  ].filter(Boolean).join(" ");

  const controlClasses = [
    "pimolu-textarea__control",
    className,
  ].filter(Boolean).join(" ");

  return scopeParts((
    <div className={mergeClasses(containerClasses, partClasses.root)}>
      {label && (
        <label
          htmlFor={textareaId}
          className={mergeClasses("pimolu-textarea__label", partClasses.label)}
        >
          {label}

          {required && (
            <span
              className={mergeClasses("pimolu-textarea__required", partClasses.required)}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <textarea
        {...props}
        ref={setTextareaRef}
        id={textareaId}
        className={mergeClasses(controlClasses, partClasses.control)}

        rows={rows}
        maxLength={maxLength}

        value={isControlled ? value : undefined}
        defaultValue={
          isControlled ? undefined : defaultValue
        }

        required={required}
        disabled={disabled}
        readOnly={readOnly}

        onChange={handleChange}

        aria-invalid={
          hasError ? true : ariaInvalid
        }

        aria-describedby={describedBy}
      />

      {(message || showCount) && (
        <div className={mergeClasses("pimolu-textarea__footer", partClasses.footer)}>
          {message && (
            <p
              id={messageId}
              className={mergeClasses(isErrorMessage
                  ? "pimolu-textarea__error"
                  : "pimolu-textarea__helper", partClasses.error)}
              role={
                isErrorMessage
                  ? "alert"
                  : undefined
              }
            >
              {message}
            </p>
          )}

          {showCount && (
            <span
              id={counterId}
              className={mergeClasses("pimolu-textarea__counter", partClasses.counter)}
            >
              {count}
              {maxLength !== undefined
                ? `/${maxLength}`
                : ""}
            </span>
          )}
        </div>
      )}
    </div>
  ));
});

Textarea.displayName = "PimoluTextarea";
