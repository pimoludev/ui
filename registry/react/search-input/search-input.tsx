"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Input } from "../input/input";
import { Kbd } from "../code/code";

import type { PimoluSearchInputProps } from "./search-input.types";

export type {
  PimoluSearchInputProps,
  PimoluSearchInputSize,
} from "./search-input.types";

export { searchInputSizes } from "./search-input.types";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export const SearchInput = forwardRef<
  HTMLInputElement,
  PimoluSearchInputProps
>(function SearchInput(
  { classNames,
    value,
    defaultValue,

    onValueChange,
    onSearch,

    placeholder = "Search…",
    shortcut,
    clearable = true,
    clearLabel = "Clear search",

    size = "md",
    label,

    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,

    disabled = false,
    className,

    name,
    autoComplete,
    autoFocus,
    id,
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("search-input", classNames, true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(
    () => defaultValue ?? ""
  );

  const currentValue = isControlled ? value : internalValue;

  function commitValue(nextValue: string) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      if (event.nativeEvent.isComposing) return;

      if (onSearch) {
        event.preventDefault();
        onSearch(currentValue);
      }

      return;
    }

    if (event.key === "Escape") {
      if (!currentValue) return;

      event.preventDefault();
      commitValue("");

      inputRef.current?.focus();
    }
  }

  return scopeParts((
    <div
      className={mergeClasses([
        "pimolu-search-input",
        `pimolu-search-input--${size}`,
        disabled && "pimolu-search-input--disabled",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
    >
      <Input
        ref={(node) => {
          inputRef.current = node;

          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        id={id}
        name={name}
        type="search"
        size={size}
        label={label}
        aria-label={label ? undefined : ariaLabel ?? "Search"}
        aria-describedby={ariaDescribedBy}
        placeholder={placeholder}
        value={currentValue}
        disabled={disabled}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        fullWidth
        clearable={clearable}
        clearLabel={clearLabel}
        startIcon={<SearchIcon />}
        endIcon={
          shortcut ? (
            <Kbd
              className={mergeClasses("pimolu-search-input__shortcut", partClasses.shortcut)}
              size={size === "lg" ? "md" : "sm"}
            >
              {shortcut}
            </Kbd>
          ) : undefined
        }
        containerClassName="pimolu-search-input__field"
        onValueChange={commitValue}
        onKeyDown={handleKeyDown}
      />
    </div>
  ));
});

SearchInput.displayName = "PimoluSearchInput";
