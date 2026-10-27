"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import type {
  PimoluTagsInputProps,
  PimoluTagsInputSize,
} from "./tags-input.types";

/* =========================================
   HELPERS
========================================= */

const sizeClass: Record<PimoluTagsInputSize, string> = {
  sm: "pimolu-tags-input--sm",
  md: "pimolu-tags-input--md",
  lg: "pimolu-tags-input--lg",
};

function normalizeTags(tags: string[]) {
  return tags
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function arraysEqual(a: string[], b: string[]) {
  return (
    a.length === b.length &&
    a.every((item, index) => item === b[index])
  );
}

/* =========================================
   TAGS INPUT
========================================= */

export const TagsInput = forwardRef<
  HTMLInputElement,
  PimoluTagsInputProps
>(function TagsInput(
  { classNames,
    id,
    value,
    defaultValue,
    onValueChange,

    maxTags,
    allowDuplicates = false,
    delimiters = [","],

    size = "md",
    label,
    helperText,
    error = false,
    errorMessage,

    fullWidth = false,

    placeholder,

    className,

    disabled = false,
    readOnly = false,
    required = false,

    "aria-label": ariaLabel,

    onKeyDown,
    onPaste,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("tags-input", classNames, true);

  const generatedId = useId();
  const inputId = id ?? `pimolu-tags-input-${generatedId}`;

  const hintId = `${inputId}-hint`;

  const message = errorMessage ?? helperText;
  const messageId = message
    ? `${inputId}-message`
    : undefined;

  const hasError = error || Boolean(errorMessage);

  const limit =
    maxTags === undefined
      ? undefined
      : Math.max(0, Math.floor(maxTags));

  const isControlled = value !== undefined;

  const [internalTags, setInternalTags] = useState<
    string[]
  >(() => normalizeTags(defaultValue ?? []));

  const tags = (
    isControlled ? value ?? [] : internalTags
  ).filter((tag) => tag.trim() !== "");

  const [draft, setDraft] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

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

  function commit(next: string[]) {
    if (arraysEqual(tags, next)) return;

    if (!isControlled) {
      setInternalTags(next);
    }

    onValueChange?.(next);
  }

  function splitText(text: string) {
    let parts = [text];

    for (const delimiter of delimiters) {
      if (!delimiter) continue;

      parts = parts.flatMap((part) =>
        part.split(delimiter)
      );
    }

    return parts
      .flatMap((part) => part.split(/\r?\n/))
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function addTags(candidates: string[]) {
    if (disabled || readOnly) return false;

    const next = [...tags];

    for (const candidate of candidates) {
      const tag = candidate.trim();

      if (!tag) continue;

      if (
        limit !== undefined &&
        next.length >= limit
      ) {
        break;
      }

      if (
        !allowDuplicates &&
        next.includes(tag)
      ) {
        continue;
      }

      next.push(tag);
    }

    if (arraysEqual(tags, next)) return false;

    commit(next);

    return true;
  }

  function removeTag(index: number) {
    if (disabled || readOnly) return;

    commit(tags.filter((_, itemIndex) => itemIndex !== index));

    inputRef.current?.focus();
  }

  function focusInput() {
    inputRef.current?.focus();
  }

  function handleContainerClick(
    event: MouseEvent<HTMLDivElement>
  ) {
    const target = event.target as HTMLElement;

    if (target.closest("button")) return;

    focusInput();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      if (!draft.trim()) return;

      event.preventDefault();
      addTags([draft]);
      setDraft("");
      return;
    }

    if (delimiters.includes(event.key)) {
      event.preventDefault();

      if (draft.trim()) {
        addTags([draft]);
        setDraft("");
      }

      return;
    }

    if (
      event.key === "Backspace" &&
      draft === "" &&
      tags.length > 0
    ) {
      event.preventDefault();
      removeTag(tags.length - 1);
      return;
    }

    if (event.key === "Escape" && draft !== "") {
      event.preventDefault();
      setDraft("");
    }
  }

  function handlePaste(
    event: ClipboardEvent<HTMLInputElement>
  ) {
    onPaste?.(event);

    if (event.defaultPrevented) return;
    if (disabled || readOnly) return;

    const text = event.clipboardData.getData("text");

    if (!text.trim()) return;

    event.preventDefault();

    addTags(splitText(text));
    setDraft("");
  }

  const describedBy =
    [
      props["aria-describedby"],
      hintId,
      messageId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const instruction =
    limit === undefined
      ? "Press Enter to add a tag. Backspace removes the last tag."
      : `Press Enter to add a tag. Backspace removes the last tag. Maximum ${limit} tags.`;

  return scopeParts((
    <div
      className={mergeClasses([
        "pimolu-tags-input",
        sizeClass[size],
        fullWidth && "pimolu-tags-input--full-width",
        hasError && "pimolu-tags-input--invalid",
        disabled && "pimolu-tags-input--disabled",
        readOnly && "pimolu-tags-input--readonly",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={mergeClasses("pimolu-tags-input__label", partClasses.label)}
        >
          {label}

          {required && (
            <span
              className={mergeClasses("pimolu-tags-input__required", partClasses.required)}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div
        className={mergeClasses("pimolu-tags-input__wrapper", partClasses.wrapper)}
        onClick={handleContainerClick}
      >
        {tags.length > 0 && (
          <ul
            className={mergeClasses("pimolu-tags-input__tags", partClasses.tags)}
            aria-label="Selected tags"
          >
            {tags.map((tag, index) => (
              <li
                key={`${tag}-${index}`}
                className={mergeClasses("pimolu-tags-input__tag", partClasses.tag)}
              >
                <span className={mergeClasses("pimolu-tags-input__tag-label", partClasses.tagLabel)}>
                  {tag}
                </span>

                <button
                  type="button"
                  className={mergeClasses("pimolu-tags-input__remove", partClasses.remove)}
                  aria-label={`Remove ${tag}`}
                  disabled={disabled || readOnly}
                  onClick={() => removeTag(index)}
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m4 4 8 8M12 4l-8 8" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <input
          {...props}
          ref={setInputRef}
          id={inputId}
          type="text"
          className={mergeClasses("pimolu-tags-input__input", partClasses.input)}
          value={draft}
          placeholder={placeholder}
          onChange={(event) =>
            setDraft(event.currentTarget.value)
          }
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-label={ariaLabel}
          aria-invalid={
            hasError ? true : props["aria-invalid"]
          }
          aria-describedby={describedBy}
        />
      </div>

      <span
        id={hintId}
        className={mergeClasses("pimolu-tags-input__sr-only", partClasses.srOnly)}
      >
        {instruction}
      </span>

      {message && (
        <p
          id={messageId}
          className={mergeClasses(hasError
              ? "pimolu-tags-input__error"
              : "pimolu-tags-input__helper", partClasses.error)}
          role={hasError ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  ));
});

TagsInput.displayName = "PimoluTagsInput";
