"use client";
import type { PimoluClassNames } from "../customization/customization.types";
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
} from "react";

import type { PimoluInputProps, PimoluInputAction } from "./input.types";
import { inputVariants } from "./input.variants";

const CLEARABLE_TYPES = new Set([
  "text",
  "search",
  "email",
  "tel",
  "url",
  "password",
]);


interface InputActionButtonProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"input">;

  action: PimoluInputAction;
  position: "start" | "end";
  disabled: boolean;
}

function InputActionButton({ classNames,
  action,
  position,
  disabled,
}: InputActionButtonProps) {
  const [partClasses, scopeParts] = usePartClasses("input", classNames, false);

  return scopeParts((
    <button
      type="button"
      className={mergeClasses([
        "pimolu-input__action",
        `pimolu-input__action--${position}`,
      ].join(" "), partClasses.action)}
      aria-label={action.label}
      disabled={disabled || action.disabled}
      onClick={action.onClick}
    >
      <span
        className={mergeClasses("pimolu-input__action-icon", partClasses.actionIcon)}
        aria-hidden="true"
      >
        {action.icon}
      </span>
    </button>
  ));
}


export const Input = forwardRef<
  HTMLInputElement,
  PimoluInputProps
>(function Input(
  {
    id,
    type = "text",
    size = "md",
    variant = "neutral",
    appearance = "outline",

    label,
    helperText,
    errorMessage,
    invalid = false,

    startIcon,
    endIcon,

    startAction,
    endAction,

    fullWidth = false,
    clearable = false,
    clearLabel,
    onValueChange,
    onClear,

    passwordToggle = false,
    showPasswordLabel = "Show password",
    hidePasswordLabel = "Hide password",

    value,
    defaultValue,
    onChange,

    required,
    disabled,
    readOnly,

    classNames,
    className,
    containerClassName,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("input", classNames, true);

  const generatedId = useId();
  const inputId = id ?? `pimolu-input-${generatedId}`;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = value !== undefined;

  const [localValue, setLocalValue] = useState(
    () => String(defaultValue ?? "")
  );

  
const [passwordVisible, setPasswordVisible] = useState(false);

  const canTogglePassword =
    passwordToggle &&
    type === "password" &&
    !disabled;

  const displayedType = canTogglePassword && passwordVisible ? "text" : type;

  function handlePasswordToggle() {
    if (!canTogglePassword) return;

    setPasswordVisible((previous) => !previous);

    inputRef.current?.focus();
  }


  const currentValue = isControlled ? String(value ?? "") : localValue;

  
/* Synchronize with native form reset */

  useEffect(() => {
    if (isControlled) return;

    const input = inputRef.current;
    const form = input?.form;

    if (!input || !form) return;

    function handleFormReset() {
      if (!input) return;

      setLocalValue(input.defaultValue);
    }

    form.addEventListener("reset", handleFormReset);

    return () => {
      form.removeEventListener("reset", handleFormReset);
    };
  }, [isControlled]);



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

  /* Normal typing */

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;

    if (!isControlled) {
      setLocalValue(nextValue);
    }

    onChange?.(event);
    onValueChange?.(nextValue);
  }

  /* Clear button */

  function handleClear() {
    if (disabled || readOnly) return;

    if (!isControlled) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setLocalValue("");
    }

    onValueChange?.("");
    onClear?.();

    inputRef.current?.focus();
  }

  const canUpdateValue =
    !isControlled ||
    Boolean(onValueChange || onClear);

  const showClearButton =
    clearable &&
    canUpdateValue &&
    !disabled &&
    !readOnly &&
    CLEARABLE_TYPES.has(type) &&
    currentValue.length > 0;

  /* Accessibility */

  const hasError = invalid || Boolean(errorMessage);

  const message = errorMessage || helperText;
  const isErrorMessage = Boolean(errorMessage);

  const messageId = message
    ? `${inputId}-message`
    : undefined;

  const describedBy = [
    props["aria-describedby"],
    messageId,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  /* Classes */

  const fieldClassName = [
    inputVariants({ size, variant, appearance }),
    fullWidth && "pimolu-input--full-width",
    hasError && "pimolu-input--invalid",
    disabled && "pimolu-input--disabled",
    containerClassName,
    partClasses.root,
  ]
    .filter(Boolean)
    .join(" ");

  const controlClassName = [
    "pimolu-input__control",
    className,
    partClasses.control,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <div className={mergeClasses(fieldClassName, partClasses.root)}>
      {label && (
        <label
          htmlFor={inputId}
          className={mergeClasses("pimolu-input__label", partClasses.label)}
        >
          {label}

          {required && (
            <span
              className={mergeClasses("pimolu-input__required", partClasses.required)}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className={mergeClasses("pimolu-input__wrapper", partClasses.wrapper)}>
        {startIcon && (
          <span
            className={mergeClasses("pimolu-input__start-icon", partClasses.startIcon)}
            aria-hidden="true"
          >
            {startIcon}
          </span>
        )}

        {startAction && (
          <InputActionButton
            action={startAction}
            position="start"
            disabled={Boolean(disabled)}
          />
        )}

        <input
          {...props}
          ref={setInputRef}
          id={inputId}
          type={displayedType}
          className={mergeClasses(controlClassName, partClasses.control)}
          value={isControlled ? value : undefined}
          defaultValue={
            isControlled ? undefined : defaultValue
          }
          onChange={handleChange}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={
            hasError ? true : props["aria-invalid"]
          }
          aria-describedby={describedBy}
        />

        {showClearButton && (
          <button
            type="button"
            className={mergeClasses("pimolu-input__clear", partClasses.clearButton)}
            aria-label={
              clearLabel ??
              (label ? `Clear ${label}` : "Clear input")
            }
            onClick={handleClear}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}

        
        {canTogglePassword && (
          <button
            type="button"
            className={mergeClasses("pimolu-input__visibility", partClasses.visibilityButton)}
            aria-label={
              passwordVisible
                ? hidePasswordLabel
                : showPasswordLabel
            }
            onClick={handlePasswordToggle}
          >
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
              {passwordVisible ? (
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
          </button>
        )}

        {endAction && (
          <InputActionButton
            action={endAction}
            position="end"
            disabled={Boolean(disabled)}
          />
        )}


        {endIcon && (
          <span
            className={mergeClasses("pimolu-input__end-icon", partClasses.endIcon)}
            aria-hidden="true"
          >
            {endIcon}
          </span>
        )}
      </div>

      {message && (
        <p
          id={messageId}
          className={mergeClasses(isErrorMessage
              ? "pimolu-input__error"
              : "pimolu-input__helper", partClasses.message)}
          role={isErrorMessage ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  ));
});

Input.displayName = "PimoluInput";
