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
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent,
} from "react";

import type {
  PimoluMultiSelectOption,
  PimoluMultiSelectProps,
} from "./multi-select.types";

import { multiSelectVariants } from "./multi-select.variants";

/* =========================================
   SEARCH HELPERS
========================================= */

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();
}

function filterOptions(
  options: readonly PimoluMultiSelectOption[],
  query: string
): PimoluMultiSelectOption[] {
  const search = normalize(query);

  if (!search) return [...options];

  return options.filter((option) =>
    normalize(
      [option.label, ...(option.keywords ?? [])].join(" ")
    ).includes(search)
  );
}

/* =========================================
   MULTI SELECT
========================================= */

export const MultiSelect = forwardRef<
  HTMLInputElement,
  PimoluMultiSelectProps
>(function MultiSelect(
  {
    id,
    name,
    form,
    options,

    value,
    defaultValue = [],
    onValueChange,
    onQueryChange,

    maxSelected,
    clearable = true,

    label,
    placeholder = "Search...",
    helperText,
    errorMessage,
    emptyMessage = "No results found.",
    requiredMessage = "Select at least one option.",

    size = "md",
    variant = "neutral",
    appearance = "outline",

    disabled = false,
    required = false,
    invalid = false,
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
     IDS AND REFS
  ====================================== */

  const generatedId = useId();
  const inputId = id ?? `pimolu-multiselect-${generatedId}`;
  const listboxId = `${inputId}-listbox`;
  const instructionsId = `${inputId}-instructions`;

  const message = errorMessage || helperText;
  const messageId = message
    ? `${inputId}-message`
    : undefined;

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const assignRef = useCallback(
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
     CONTROLLED / UNCONTROLLED SELECTION
  ====================================== */

  const controlled = value !== undefined;

  const [internalValues, setInternalValues] =
    useState<string[]>(() => [
      ...new Set(defaultValue),
    ]);

  const selectedValues: readonly string[] =
    controlled ? value : internalValues;

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredOptions = useMemo(
    () => filterOptions(options, query),
    [options, query]
  );

  /* ======================================
     OPTION HELPERS
  ====================================== */

  function isAvailable(
    option: PimoluMultiSelectOption,
    values: readonly string[] = selectedValues
  ): boolean {
    if (option.disabled) return false;

    const limitReached =
      maxSelected !== undefined &&
      values.length >= maxSelected;

    return (
      values.includes(option.value) ||
      !limitReached
    );
  }

  function firstAvailableIndex(
    items: readonly PimoluMultiSelectOption[],
    values: readonly string[] = selectedValues
  ): number {
    return items.findIndex((option) =>
      isAvailable(option, values)
    );
  }

  function emitValues(next: string[]) {
    if (!controlled) {
      setInternalValues(next);
    }

    onValueChange?.(next);
  }

  function resetQuery() {
    setQuery("");
    onQueryChange?.("");
  }

  function openMenu() {
    if (disabled) return;

    setActiveIndex(
      firstAvailableIndex(filteredOptions)
    );
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
    setActiveIndex(-1);
    resetQuery();
  }

  function toggleOption(
    option: PimoluMultiSelectOption
  ) {
    if (disabled || !isAvailable(option)) return;

    const alreadySelected =
      selectedValues.includes(option.value);

    const next = alreadySelected
      ? selectedValues.filter(
          (item) => item !== option.value
        )
      : [...selectedValues, option.value];

    inputRef.current?.focus();

    emitValues(next);
    resetQuery();

    setActiveIndex(
      firstAvailableIndex(options, next)
    );
    setIsOpen(true);
  }

  function removeValue(valueToRemove: string) {
    if (disabled) return;

    const next = selectedValues.filter(
      (item) => item !== valueToRemove
    );

    if (next.length === selectedValues.length) {
      return;
    }

    inputRef.current?.focus();
    emitValues(next);
    closeMenu();
  }

  function clearAll() {
    if (disabled || selectedValues.length === 0) {
      return;
    }

    inputRef.current?.focus();
    emitValues([]);
    closeMenu();
  }

  /* ======================================
     SEARCH INPUT
  ====================================== */

  function handleQueryChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextQuery = event.currentTarget.value;
    const nextOptions = filterOptions(
      options,
      nextQuery
    );

    setQuery(nextQuery);
    onQueryChange?.(nextQuery);

    setActiveIndex(
      firstAvailableIndex(nextOptions)
    );

    setIsOpen(true);
  }

  /* ======================================
     KEYBOARD NAVIGATION
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

      const indexes = filteredOptions
        .map((option, index) =>
          isAvailable(option) ? index : -1
        )
        .filter((index) => index >= 0);

      if (indexes.length === 0) return;

      const position = indexes.indexOf(activeIndex);

      const nextPosition =
        event.key === "ArrowDown"
          ? (position + 1) % indexes.length
          : position <= 0
            ? indexes.length - 1
            : position - 1;

      setActiveIndex(indexes[nextPosition]);
      return;
    }

    if (event.key === "Enter" && isOpen) {
      event.preventDefault();

      const option = filteredOptions[activeIndex];

      if (option && isAvailable(option)) {
        toggleOption(option);
      }

      return;
    }

    if (
      event.key === "Backspace" &&
      query === "" &&
      selectedValues.length > 0
    ) {
      event.preventDefault();

      removeValue(
        selectedValues[selectedValues.length - 1]
      );

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
     CLOSE WHEN FOCUS LEAVES
  ====================================== */

  function handleRootBlur(
    event: ReactFocusEvent<HTMLDivElement>
  ) {
    const nextTarget = event.relatedTarget;

    if (
      !(nextTarget instanceof Node) ||
      !event.currentTarget.contains(nextTarget)
    ) {
      closeMenu();
    }
  }

  /* ======================================
     CLICK OUTSIDE
  ====================================== */

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
        setQuery("");
        onQueryChange?.("");
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [isOpen, onQueryChange]);

  /* ======================================
     NATIVE FORM RESET
  ====================================== */

  useEffect(() => {
    if (controlled) return;

    const nativeForm = inputRef.current?.form;
    if (!nativeForm) return;

    function handleReset() {
      setInternalValues([
        ...new Set(defaultValue),
      ]);

      setQuery("");
      setIsOpen(false);
      setActiveIndex(-1);
    }

    nativeForm.addEventListener("reset", handleReset);

    return () => {
      nativeForm.removeEventListener(
        "reset",
        handleReset
      );
    };
  }, [controlled, defaultValue]);

  /* ======================================
     NATIVE FORM VALIDATION
  ====================================== */

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.setCustomValidity(
      required &&
      !disabled &&
      selectedValues.length === 0
        ? requiredMessage
        : ""
    );
  }, [
    required,
    disabled,
    selectedValues,
    requiredMessage,
  ]);

  /* ======================================
     ACTIVE OPTION SCROLL
  ====================================== */

  useEffect(() => {
    if (!isOpen) return;

    const element =
      listboxRef.current?.querySelector<HTMLElement>(
        '[data-active="true"]'
      );

    element?.scrollIntoView?.({
      block: "nearest",
    });
  }, [isOpen, activeIndex]);

  /* ======================================
     ACCESSIBILITY AND CLASSES
  ====================================== */

  const hasError = invalid || Boolean(errorMessage);

  const describedBy = [
    ariaDescribedBy,
    messageId,
    instructionsId,
  ].filter(Boolean).join(" ");

  const activeOption =
    isOpen ? filteredOptions[activeIndex] : undefined;

  const activeDescendant =
    activeOption && isAvailable(activeOption)
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  const rootClasses = [
    multiSelectVariants({ size, variant, appearance }),
    fullWidth && "pimolu-multiselect--full-width",
    hasError && "pimolu-multiselect--invalid",
    disabled && "pimolu-multiselect--disabled",
    isOpen && "pimolu-multiselect--open",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={rootRef}
      className={rootClasses}
      style={style}
      onBlur={handleRootBlur}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="pimolu-multiselect__label"
        >
          {label}

          {required && (
            <span
              className="pimolu-multiselect__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="pimolu-multiselect__field">
        <div
          className="pimolu-multiselect__value-area"
          onClick={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              inputRef.current?.focus();
            }
          }}
        >
          {/* Selected tags */}

          {selectedValues.map((selectedValue) => {
            const option = options.find(
              (item) => item.value === selectedValue
            );

            const selectedLabel =
              option?.label ?? selectedValue;

            return (
              <span
                key={selectedValue}
                className="pimolu-multiselect__tag"
              >
                <span className="pimolu-multiselect__tag-label">
                  {selectedLabel}
                </span>

                <button
                  type="button"
                  className="pimolu-multiselect__tag-remove"
                  aria-label={`Remove ${selectedLabel}`}
                  disabled={disabled}
                  onClick={() =>
                    removeValue(selectedValue)
                  }
                >
                  <span aria-hidden="true">
                    ×
                  </span>
                </button>
              </span>
            );
          })}

          {/* Search combobox */}

          <input
            ref={assignRef}
            id={inputId}
            form={form}
            type="text"

            className={[
              "pimolu-multiselect__input",
              inputClassName,
            ].filter(Boolean).join(" ")}

            value={query}
            placeholder={
              selectedValues.length === 0
                ? placeholder
                : ""
            }

            disabled={disabled}
            autoComplete="off"

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

            onFocus={openMenu}
            onClick={openMenu}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
          />

          {clearable &&
            selectedValues.length > 0 &&
            !disabled && (
              <button
                type="button"
                className="pimolu-multiselect__clear"
                aria-label="Clear all selections"
                onClick={clearAll}
              >
                <span aria-hidden="true">×</span>
              </button>
            )}

          <span
            className="pimolu-multiselect__chevron"
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
        </div>

        {/* FormData.getAll(name) returns the array */}

        {name &&
          selectedValues.map((selectedValue) => (
            <input
              key={selectedValue}
              type="hidden"
              name={name}
              form={form}
              value={selectedValue}
              disabled={disabled}
              readOnly
            />
          ))}

        {isOpen && !disabled && (
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-label={
              label
                ? `Options: ${label}`
                : "Options"
            }
            className="pimolu-multiselect__listbox"
          >
            {filteredOptions.length === 0 ? (
              <li
                className="pimolu-multiselect__empty"
                role="presentation"
              >
                <span role="status">
                  {emptyMessage}
                </span>
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const selected =
                  selectedValues.includes(option.value);

                const available = isAvailable(option);

                return (
                  <li
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={!available || undefined}
                    data-active={
                      index === activeIndex
                        ? "true"
                        : undefined
                    }
                    className={[
                      "pimolu-multiselect__option",
                      selected &&
                        "pimolu-multiselect__option--selected",
                      !available &&
                        "pimolu-multiselect__option--disabled",
                    ].filter(Boolean).join(" ")}

                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}

                    onClick={() => toggleOption(option)}
                  >
                    <span
                      className="pimolu-multiselect__option-indicator"
                      aria-hidden="true"
                    >
                      {selected ? "✓" : ""}
                    </span>

                    <span className="pimolu-multiselect__option-label">
                      {option.label}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      <span
        id={instructionsId}
        className="pimolu-multiselect__sr-only"
      >
        Use arrow keys to browse options and Enter to
        toggle a selection. Press Backspace in an empty
        search field to remove the last selection.
      </span>

      {message && (
        <p
          id={messageId}
          className={
            errorMessage
              ? "pimolu-multiselect__error"
              : "pimolu-multiselect__helper"
          }
          role={errorMessage ? "alert" : undefined}
        >
          {message}
        </p>
      )}

      {maxSelected !== undefined && (
        <span className="pimolu-multiselect__count">
          {selectedValues.length}/{maxSelected} selected
        </span>
      )}
    </div>
  );
});

MultiSelect.displayName = "PimoluMultiSelect";
