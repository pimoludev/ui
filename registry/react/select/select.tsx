"use client";

import {
  Children,
  Fragment,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

import type { PimoluSelectProps } from "./select.types";

import { selectVariants } from "./select.variants";

import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useFormReset } from "../internal/use-form-reset";
import { useOutsidePointer } from "../internal/use-outside-pointer";

/* =========================================
   OPTIONS
========================================= */

interface ParsedOption {
  value: string;
  label: string;
  disabled: boolean;
  group?: string;
}

/**
 * The public API stays `<option>` children, so the styled control and the
 * native control read the same source. `<optgroup>` are walked through and
 * only keep their label, which the listbox renders as a heading.
 */
function parseOptions(children: ReactNode): ParsedOption[] {
  const options: ParsedOption[] = [];

  function walk(nodes: ReactNode, group?: string) {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return;

      const props = child.props as {
        value?: unknown;
        label?: string;
        disabled?: boolean;
        children?: ReactNode;
      };

      if (child.type === Fragment) {
        walk(props.children, group);
        return;
      }

      if (child.type === "optgroup") {
        walk(props.children, props.label ?? "");
        return;
      }

      const label =
        typeof props.children === "string" ||
        typeof props.children === "number"
          ? String(props.children)
          : "";

      options.push({
        value:
          props.value !== undefined
            ? String(props.value)
            : label,

        label,
        disabled: Boolean(props.disabled),
        group,
      });
    });
  }

  walk(children);

  return options;
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* =========================================
   SELECT
========================================= */

export const Select = forwardRef<HTMLElement, PimoluSelectProps>(
  function Select(
    {
      id,
      children,

      label,
      placeholder,
      helperText,
      errorMessage,
      invalid = false,

      size = "md",
      variant = "neutral",
      appearance = "outline",
      fullWidth = false,

      value,
      defaultValue,

      required = false,
      disabled = false,

      native = false,

      name,

      onChange,
      onValueChange,

      className,
      containerClassName,

      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,

      ...nativeProps
    },
    ref
  ) {
    /* Stable accessible IDs */

    const generatedId = useId();
    const selectId = id ?? `pimolu-select-${generatedId}`;

    const labelId = `${selectId}-label`;
    const listboxId = `${selectId}-listbox`;

    const optionId = (index: number) =>
      `${selectId}-option-${index}`;

    /* Value */

    const options = parseOptions(children);

    const isControlled = value !== undefined;

    const firstEnabled =
      options.find((option) => !option.disabled)?.value ??
      "";

    const [initialValue] = useState(
      () =>
        defaultValue ??
        (placeholder !== undefined ? "" : firstEnabled)
    );

    const [internalValue, setInternalValue] =
      useState(initialValue);

    const current = isControlled
      ? String(value)
      : internalValue;

    const selectedOption = options.find(
      (option) => option.value === current
    );

    const displayLabel = selectedOption
      ? selectedOption.label
      : placeholder ?? current;

    /* Styled control state */

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const listboxRef = useRef<HTMLDivElement | null>(null);
    const nativeRef = useRef<HTMLSelectElement | null>(null);

    const position = useAnchoredPosition(
      triggerRef,
      listboxRef,
      open && !native
    );

    useOutsidePointer([rootRef, listboxRef], open, () =>
      setOpen(false)
    );

    /* A native reset restores the DOM default; the state follows it. */

    useFormReset(nativeRef, !isControlled, () => {
      setInternalValue(initialValue);
      setOpen(false);
      setActiveIndex(-1);
    });

    /* The panel keeps the active option in view while the arrows move
       through a long list. */

    useEffect(() => {
      if (!open || activeIndex < 0) return;

      const node = listboxRef.current?.querySelector(
        `[id="${optionId(activeIndex)}"]`
      );

      node?.scrollIntoView?.({ block: "nearest" });
    }, [open, activeIndex]);

    /* Accessibility */

    const hasError = invalid || Boolean(errorMessage);
    const message = errorMessage || helperText;

    const messageId = message
      ? `${selectId}-message`
      : undefined;

    const describedBy = [
      ariaDescribedBy,
      messageId,
    ].filter(Boolean).join(" ") || undefined;

    /* Classes */

    const containerClasses = [
      selectVariants({ size, variant, appearance }),

      fullWidth && "pimolu-select--full-width",
      hasError && "pimolu-select--invalid",
      disabled && "pimolu-select--disabled",

      containerClassName,
    ].filter(Boolean).join(" ");

    const controlClasses = [
      "pimolu-select__control",
      className,
    ].filter(Boolean).join(" ");

    /* Selection */

    function commit(nextValue: string, event?: ChangeEvent<HTMLSelectElement>) {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      if (event) onChange?.(event);

      onValueChange?.(nextValue);
    }

    function selectOption(option: ParsedOption) {
      if (option.disabled) return;

      commit(option.value);
      setOpen(false);
      setActiveIndex(-1);
      triggerRef.current?.focus();
    }

    function moveActive(step: number) {
      if (options.length === 0) return;

      let index = activeIndex;

      for (let attempt = 0; attempt < options.length; attempt += 1) {
        index =
          (index + step + options.length) % options.length;

        if (!options[index].disabled) break;
      }

      setActiveIndex(index);
    }

    function openOnSelection() {
      const selected = options.findIndex(
        (option) => option.value === current && !option.disabled
      );

      const first = options.findIndex(
        (option) => !option.disabled
      );

      setActiveIndex(selected >= 0 ? selected : first);
      setOpen(true);
    }

    function handleTriggerKeyDown(
      event: KeyboardEvent<HTMLButtonElement>
    ) {
      const { key } = event;

      if (
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "Enter" ||
        key === " "
      ) {
        event.preventDefault();

        if (!open) {
          openOnSelection();
          return;
        }

        if (key === "Enter" || key === " ") {
          const option = options[activeIndex];
          if (option) selectOption(option);
          return;
        }

        moveActive(key === "ArrowDown" ? 1 : -1);
        return;
      }

      if (key === "Home" || key === "End") {
        if (!open) return;

        event.preventDefault();

        setActiveIndex(key === "Home" ? 0 : options.length - 1);
        return;
      }

      if (key === "Escape") {
        if (!open) return;

        event.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        return;
      }

      if (key === "Tab") {
        setOpen(false);
        return;
      }

      /* Typeahead on the first character of a label. */

      if (key.length === 1 && key.trim() !== "") {
        const match = options.findIndex(
          (option) =>
            !option.disabled &&
            option.label
              .toLowerCase()
              .startsWith(key.toLowerCase())
        );

        if (match >= 0) {
          setActiveIndex(match);

          if (!open) setOpen(true);
        }
      }
    }

    /* The styled control drives the value; the native select stays in the
       DOM for form submission and constraint validation. */

    if (native) {
      return (
        <div className={containerClasses}>
          {label && (
            <label
              htmlFor={selectId}
              className="pimolu-select__label"
            >
              {label}

              {required && (
                <span
                  className="pimolu-select__required"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </label>
          )}

          <div className="pimolu-select__field">
            <select
              {...nativeProps}
              ref={ref as Ref<HTMLSelectElement>}
              id={selectId}
              name={name}
              className={controlClasses}
              value={value}
              defaultValue={
                isControlled ? undefined : initialValue
              }
              required={required}
              disabled={disabled}
              onChange={(event) => {
                onChange?.(event);
                onValueChange?.(event.currentTarget.value);
              }}
              aria-invalid={hasError ? true : ariaInvalid}
              aria-label={ariaLabel}
              aria-describedby={describedBy}
            >
              {placeholder !== undefined && (
                <option value="" disabled={required}>
                  {placeholder}
                </option>
              )}

              {children}
            </select>

            <span
              className="pimolu-select__chevron"
              aria-hidden="true"
            >
              <Chevron />
            </span>
          </div>

          {message && (
            <p
              id={messageId}
              className={
                errorMessage
                  ? "pimolu-select__error"
                  : "pimolu-select__helper"
              }
              role={errorMessage ? "alert" : undefined}
            >
              {message}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        {label && (
          <span
            id={labelId}
            className="pimolu-select__label"
          >
            {label}

            {required && (
              <span
                className="pimolu-select__required"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </span>
        )}

        <div className="pimolu-select__field" ref={rootRef}>
          <button
            {...(nativeProps as ButtonHTMLAttributes<HTMLButtonElement>)}
            ref={(node) => {
              triggerRef.current = node;

              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (ref as { current: HTMLElement | null }).current =
                  node;
              }
            }}
            type="button"
            id={selectId}
            className={`${controlClasses} pimolu-select__trigger`}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listboxId : undefined}
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : ariaLabel}
            aria-required={required || undefined}
            aria-activedescendant={
              open && activeIndex >= 0
                ? optionId(activeIndex)
                : undefined
            }
            aria-invalid={hasError ? true : ariaInvalid}
            aria-describedby={describedBy}
            disabled={disabled}
            onClick={() => {
              if (open) {
                setOpen(false);
                setActiveIndex(-1);
              } else {
                openOnSelection();
              }
            }}
            onKeyDown={handleTriggerKeyDown}
          >
            <span
              className={
                selectedOption
                  ? "pimolu-select__value"
                  : "pimolu-select__value pimolu-select__value--placeholder"
              }
            >
              {displayLabel}
            </span>
          </button>

          {/* Submitted with the form, kept in the accessibility tree out
              of the way: the combobox above is the real control. */}

          <select
            ref={nativeRef}
            className="pimolu-select__native"
            name={name}
            value={current}
            required={required}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              commit(event.currentTarget.value, event);
            }}
          >
            {placeholder !== undefined && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}

            {children}
          </select>

          <span
            className="pimolu-select__chevron"
            aria-hidden="true"
          >
            <Chevron />
          </span>
        </div>

        {open && (
          <Portal>
            <div
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              className="pimolu-select__listbox"
              style={position}
              aria-labelledby={label ? labelId : undefined}
            >
              {options.map((option, index) => (
                <Fragment key={`${option.value}-${index}`}>
                  {option.group &&
                    option.group !==
                      options[index - 1]?.group && (
                      <div
                        className="pimolu-select__group"
                        role="presentation"
                      >
                        {option.group}
                      </div>
                    )}

                  <div
                  id={optionId(index)}
                  role="option"
                  className="pimolu-select__option"
                  aria-selected={option.value === current}
                  aria-disabled={option.disabled || undefined}
                  data-active={
                    index === activeIndex ? "true" : undefined
                  }
                  onPointerDown={(event) => {
                    event.preventDefault();
                    selectOption(option);
                  }}
                  onPointerMove={() => setActiveIndex(index)}
                >
                  {option.label}
                </div>
                </Fragment>
              ))}
            </div>
          </Portal>
        )}

        {message && (
          <p
            id={messageId}
            className={
              errorMessage
                ? "pimolu-select__error"
                : "pimolu-select__helper"
            }
            role={errorMessage ? "alert" : undefined}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "PimoluSelect";
