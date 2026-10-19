"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import type {
  PimoluComboboxOption,
  PimoluComboboxProps,
} from "./combobox.types";

import { comboboxVariants } from "./combobox.variants";

import { filterByQuery } from "../internal/search";
import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useCustomValidity } from "../internal/use-custom-validity";
import { useFormReset } from "../internal/use-form-reset";
import { useOutsidePointer } from "../internal/use-outside-pointer";

/* =========================================
   SEARCH
   Filtering lives in ../internal/search
========================================= */

/* =========================================
   COMBOBOX
========================================= */

export const Combobox = forwardRef<
  HTMLInputElement,
  PimoluComboboxProps
>(function Combobox(
  {
    id,
    name,
    form,

    options,
    value,
    defaultValue = "",

    onValueChange,
    onQueryChange,

    label,
    placeholder = "Search...",
    helperText,
    errorMessage,
    emptyMessage = "No results found.",
    requiredMessage = "Please select an option.",

    size = "md",
    variant = "neutral",
    appearance = "outline",

    disabled = false,
    required = false,
    invalid = false,
    clearable = false,
    fullWidth = false,

    className,
    inputClassName,
    style,

    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
  },
  forwardedRef
) {
  /* ======================================
     IDS & REFS
  ====================================== */

  const generatedId = useId();

  const inputId =
    id ?? `pimolu-combobox-${generatedId}`;

  const listboxId = `${inputId}-listbox`;

  const messageId =
    helperText || errorMessage
      ? `${inputId}-message`
      : undefined;

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const assignInputRef = useCallback(
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

  /* ======================================
     SELECTION STATE
  ====================================== */

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] =
    useState(defaultValue);

  const selectedValue = isControlled
    ? value
    : internalValue;

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  /* null = show the selected label, string = user is searching */

  const [query, setQuery] = useState<string | null>(
    null
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredOptions = useMemo(
    () => filterByQuery(options, query ?? ""),
    [options, query]
  );

  const inputText =
    query ?? selectedOption?.label ?? "";

  /* ======================================
     HELPERS
  ====================================== */

  function updateValue(nextValue: string) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    if (nextValue !== selectedValue) {
      onValueChange?.(nextValue);
    }
  }

  function getInitialActiveIndex(
    currentOptions: readonly PimoluComboboxOption[]
  ) {
    const selectedIndex = currentOptions.findIndex(
      (option) =>
        option.value === selectedValue &&
        !option.disabled
    );

    return selectedIndex >= 0
      ? selectedIndex
      : currentOptions.findIndex(
          (option) => !option.disabled
        );
  }

  function openMenu() {
    if (disabled) return;

    setActiveIndex(
      getInitialActiveIndex(filteredOptions)
    );

    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
    setActiveIndex(-1);
    setQuery(null);
  }

  function selectOption(
    option: PimoluComboboxOption
  ) {
    if (disabled || option.disabled) return;

    updateValue(option.value);
    setQuery(null);

    inputRef.current?.focus();

    setIsOpen(false);
    setActiveIndex(-1);
  }

  function clearSelection() {
    if (disabled) return;

    updateValue("");
    setQuery(null);

    inputRef.current?.focus();

    setIsOpen(false);
    setActiveIndex(-1);
  }

  /* ======================================
     TEXT SEARCH
  ====================================== */

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextQuery = event.currentTarget.value;

    setQuery(nextQuery);
    onQueryChange?.(nextQuery);

    const nextOptions = filterByQuery(
      options,
      nextQuery
    );

    setActiveIndex(
      nextOptions.findIndex(
        (option) => !option.disabled
      )
    );

    setIsOpen(true);

    /* Typing invalidates a previous selection. */

    if (selectedValue !== "") {
      updateValue("");
    }
  }

  /* ======================================
     KEYBOARD
  ====================================== */

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (disabled) return;

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
        return;
      }

      const enabledIndexes = filteredOptions
        .map((option, index) =>
          option.disabled ? -1 : index
        )
        .filter((index) => index >= 0);

      if (enabledIndexes.length === 0) return;

      const position =
        enabledIndexes.indexOf(activeIndex);

      let nextPosition: number;

      if (event.key === "ArrowDown") {
        nextPosition =
          (position + 1) % enabledIndexes.length;
      } else {
        nextPosition =
          position <= 0
            ? enabledIndexes.length - 1
            : position - 1;
      }

      setActiveIndex(
        enabledIndexes[nextPosition]
      );

      return;
    }

    if (event.key === "Enter" && isOpen) {
      event.preventDefault();

      const option = filteredOptions[activeIndex];

      if (option && !option.disabled) {
        selectOption(option);
      }

      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === "Tab" && isOpen) {
      closeMenu();
    }
  }

  /* ======================================
     SHARED BEHAVIOURS
  ====================================== */

    const { style: popupStyle } = useAnchoredPosition(
      rootRef,
      listboxRef,
      isOpen && !disabled
    );

  useOutsidePointer(
    [rootRef, listboxRef],
    isOpen,
    closeMenu
  );

  useFormReset(inputRef, !isControlled, () => {
    setInternalValue(defaultValue);
    setQuery(null);
    setIsOpen(false);
    setActiveIndex(-1);
  });

  useCustomValidity(
    inputRef,
    required && !disabled && selectedValue === ""
      ? requiredMessage
      : ""
  );

  /* ======================================
     KEEP THE ACTIVE OPTION VISIBLE
  ====================================== */

  useEffect(() => {
    if (!isOpen) return;

    const activeOption =
      listboxRef.current?.querySelector<HTMLElement>(
        '[data-active="true"]'
      );

    if (
      activeOption &&
      typeof activeOption.scrollIntoView === "function"
    ) {
      activeOption.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex, isOpen]);

  /* ======================================
     ACCESSIBILITY
  ====================================== */

  const hasError =
    invalid || Boolean(errorMessage);

  const describedBy = [
    ariaDescribedBy,
    messageId,
  ].filter(Boolean).join(" ") || undefined;

  const currentActiveOption =
    isOpen ? filteredOptions[activeIndex] : undefined;

  const activeDescendant =
    currentActiveOption &&
    !currentActiveOption.disabled
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  /* ======================================
     CLASSES
  ====================================== */

  const rootClassName = [
    comboboxVariants({ size, variant, appearance }),

    fullWidth && "pimolu-combobox--full-width",
    hasError && "pimolu-combobox--invalid",
    disabled && "pimolu-combobox--disabled",
    isOpen && "pimolu-combobox--open",

    clearable &&
      selectedValue !== "" &&
      !disabled &&
      "pimolu-combobox--has-clear",

    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      style={style}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="pimolu-combobox__label"
        >
          {label}

          {required && (
            <span
              className="pimolu-combobox__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="pimolu-combobox__field">
        <input
          ref={assignInputRef}
          id={inputId}
          form={form}
          type="text"

          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={
            isOpen ? listboxId : undefined
          }
          aria-activedescendant={activeDescendant}

          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          aria-invalid={hasError || undefined}

          autoComplete="off"
          required={required}
          disabled={disabled}

          className={[
            "pimolu-combobox__input",
            inputClassName,
          ].filter(Boolean).join(" ")}

          value={inputText}
          placeholder={placeholder}

          onFocus={openMenu}
          onClick={openMenu}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        {/* The selected value, not the search text,
            is what the form submits. */}

        {name && (
          <input
            type="hidden"
            name={name}
            form={form}
            value={selectedValue}
            disabled={disabled}
            readOnly
          />
        )}

        {clearable &&
          selectedValue !== "" &&
          !disabled && (
            <button
              type="button"
              className="pimolu-combobox__clear"
              aria-label="Clear selection"
              onClick={clearSelection}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}

        <span
          className="pimolu-combobox__chevron"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>

        {/* Custom listbox */}

        {isOpen && !disabled && (
          <Portal>
          <ul
            ref={listboxRef}
            id={listboxId}
            className="pimolu-combobox__listbox"
            style={popupStyle}
            role="listbox"
            aria-label={
              label ? `Options : ${label}` : "Options"
            }
          >
            {filteredOptions.length === 0 ? (
              <li
                className="pimolu-combobox__empty"
                role="presentation"
              >
                <span role="status">
                  {emptyMessage}
                </span>
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  role="option"

                  aria-selected={
                    option.value === selectedValue
                  }
                  aria-disabled={
                    option.disabled || undefined
                  }

                  data-active={
                    index === activeIndex
                      ? "true"
                      : undefined
                  }

                  className={[
                    "pimolu-combobox__option",
                    option.disabled &&
                      "pimolu-combobox__option--disabled",
                  ].filter(Boolean).join(" ")}

                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}

                  onClick={() => {
                    selectOption(option);
                  }}
                >
                  <span className="pimolu-combobox__option-label">
                    {option.label}
                  </span>

                  {option.value === selectedValue && (
                    <svg
                      className="pimolu-combobox__check"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
          </Portal>
        )}
      </div>

      {(errorMessage || helperText) && (
        <p
          id={messageId}
          className={
            errorMessage
              ? "pimolu-combobox__error"
              : "pimolu-combobox__helper"
          }
          role={
            errorMessage ? "alert" : undefined
          }
        >
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
});

Combobox.displayName = "PimoluCombobox";
