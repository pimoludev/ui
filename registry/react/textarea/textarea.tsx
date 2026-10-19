"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import type {
  PimoluTextareaProps,
} from "./textarea.types";

import { textareaVariants } from "./textarea.variants";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  PimoluTextareaProps
>(function Textarea(
  {
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

  useEffect(() => {
    if (isControlled) return;

    const textarea = textareaRef.current;
    const form = textarea?.form;

    if (!textarea || !form) return;

    function handleReset() {
      setLocalValue(textarea!.defaultValue);
    }

    form.addEventListener("reset", handleReset);

    return () => {
      form.removeEventListener("reset", handleReset);
    };
  }, [isControlled]);

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

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={textareaId}
          className="pimolu-textarea__label"
        >
          {label}

          {required && (
            <span
              className="pimolu-textarea__required"
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
        className={controlClasses}

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
        <div className="pimolu-textarea__footer">
          {message && (
            <p
              id={messageId}
              className={
                isErrorMessage
                  ? "pimolu-textarea__error"
                  : "pimolu-textarea__helper"
              }
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
              className="pimolu-textarea__counter"
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
  );
});

Textarea.displayName = "PimoluTextarea";
