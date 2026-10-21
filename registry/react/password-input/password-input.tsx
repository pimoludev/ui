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
} from "react";

import type { PimoluPasswordInputProps } from "./password-input.types";

/**
 * `useLayoutEffect` warns during SSR; effects do not run there anyway.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined"
    ? useLayoutEffect
    : useEffect;

interface SelectionSnapshot {
  start: number | null;
  end: number | null;
}

function VisibilityIcon({
  visible,
}: {
  visible: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {visible ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 5.2A11.6 11.6 0 0 1 12 5c5 0 9.3 3.2 10 7a10.5 10.5 0 0 1-3.4 5.6" />
          <path d="M6.3 6.3A10.9 10.9 0 0 0 2 12c.7 3.8 5 7 10 7a10 10 0 0 0 4.2-.9" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      ) : (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PimoluPasswordInputProps
>(function PasswordInput(
  {
    id,
    value,
    defaultValue,
    onValueChange,
    onChange,
    size = "md",

    label,
    description,
    error,
    invalid = false,

    placeholder,
    autoComplete,

    disabled = false,
    readOnly = false,
    required = false,

    showLabel = "Show password",
    hideLabel = "Hide password",

    fullWidth = false,

    className,
    containerClassName,

    "aria-describedby": ariaDescribedBy,

    ...props
  },
  forwardedRef
) {
  const generatedId = useId();
  const inputId =
    id ?? `pimolu-password-input-${generatedId}`;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectionRef = useRef<SelectionSnapshot | null>(
    null
  );

  const isControlled = value !== undefined;

  const [visible, setVisible] = useState(false);

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

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextValue = event.currentTarget.value;

    onChange?.(event);
    onValueChange?.(nextValue);
  }

  function handleToggle() {
    if (disabled) return;

    const input = inputRef.current;

    if (input) {
      selectionRef.current = {
        start: input.selectionStart,
        end: input.selectionEnd,
      };
    }

    setVisible((previous) => !previous);
  }

  /*
   * Switching the input type can move the caret to the end.
   * Restore the selection captured before the toggle.
   */
  useIsomorphicLayoutEffect(() => {
    const input = inputRef.current;
    const selection = selectionRef.current;

    if (!input || !selection) return;

    selectionRef.current = null;

    if (
      selection.start === null ||
      selection.end === null
    ) {
      return;
    }

    try {
      input.setSelectionRange(
        selection.start,
        selection.end
      );
    } catch {
      /* Some input types do not expose a selection. */
    }
  }, [visible]);

  /* Accessibility */

  const hasError = invalid || Boolean(error);

  const message = error ?? description;
  const isErrorMessage = Boolean(error);

  const messageId = message
    ? `${inputId}-message`
    : undefined;

  const describedBy =
    [ariaDescribedBy, messageId]
      .filter(Boolean)
      .join(" ") || undefined;

  /* Classes */

  const fieldClassName = [
    "pimolu-input",
    `pimolu-input--${size}`,
    "pimolu-password-input",
    `pimolu-password-input--${size}`,
    fullWidth && "pimolu-input--full-width",
    hasError && "pimolu-input--invalid",
    disabled && "pimolu-input--disabled",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const controlClassName = [
    "pimolu-input__control",
    "pimolu-password-input__control",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldClassName}>
      {label && (
        <label
          htmlFor={inputId}
          className="pimolu-input__label"
        >
          {label}

          {required && (
            <span
              className="pimolu-input__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="pimolu-input__wrapper pimolu-password-input__wrapper">
        <input
          {...props}
          ref={setInputRef}
          id={inputId}
          type={visible ? "text" : "password"}
          className={controlClassName}
          value={isControlled ? value : undefined}
          defaultValue={
            isControlled ? undefined : defaultValue
          }
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={
            hasError ? true : props["aria-invalid"]
          }
          aria-describedby={describedBy}
        />

        <button
          type="button"
          className="pimolu-input__visibility pimolu-password-input__toggle"
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          aria-controls={inputId}
          title={visible ? hideLabel : showLabel}
          disabled={disabled}
          onClick={handleToggle}
        >
          <VisibilityIcon visible={visible} />
        </button>
      </div>

      {message && (
        <p
          id={messageId}
          className={
            isErrorMessage
              ? "pimolu-input__error"
              : "pimolu-input__helper"
          }
          role={isErrorMessage ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = "PimoluPasswordInput";
