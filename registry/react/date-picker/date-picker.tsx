"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import type { PimoluDatePickerProps } from "./date-picker.types";

import { Calendar } from "../calendar/calendar";
import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import { usePresence } from "../internal/use-presence";

/* =========================================
   HELPERS
========================================= */

/** Must match the exit animation duration in date-picker.css. */
const EXIT_DURATION = 120;

function isoDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

/* =========================================
   DATE PICKER
========================================= */

export const DatePicker = forwardRef<
  HTMLButtonElement,
  PimoluDatePickerProps
>(function DatePicker(
  {
    id,
    name,

    value,
    defaultValue = null,
    onChange,

    placeholder = "Select date",
    label,

    min,
    max,
    disabledDates,

    disabled = false,
    readOnly = false,
    required = false,
    clearable = true,
    fullWidth = false,

    locale = "en-US",
    weekStartsOn = 0,
    clearLabel,

    className,
    "aria-label": ariaLabel,
  },
  forwardedRef
) {
  const generatedId = useId();

  const triggerId =
    id ?? `pimolu-date-picker-${generatedId}`;

  const labelId = `${triggerId}-label`;
  const valueId = `${triggerId}-value`;
  const panelId = `${triggerId}-panel`;

  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] =
    useState<Date | null>(defaultValue);

  const [open, setOpen] = useState(false);

  const currentValue = isControlled
    ? value
    : internalValue;

  const { rendered, state } = usePresence(
    open,
    EXIT_DURATION
  );

  const { style: panelStyle, side } = useAnchoredPosition(
    triggerRef,
    panelRef,
    rendered,
    {
      placement: "bottom",
      gap: 8,
      maxHeight: 480,
      maxWidth: 380,
      matchWidth: false,
    }
  );

  useDismissableLayer({
    open,
    target: [fieldRef, panelRef],
    onDismiss: () => setOpen(false),
    closeOnEscape: false,
  });

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [locale]
  );

  const formattedValue = currentValue
    ? dateFormatter.format(currentValue)
    : null;

  const assignTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  /* Focusing the selected day (or today) instead of the first focusable
     element keeps keyboard users in the grid when the panel opens. */

  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;

      if (!node || !open) return;

      const target = node.querySelector<HTMLElement>(
        '[role="gridcell"][tabindex="0"]'
      );

      (target ?? node).focus();
    },
    [open]
  );

  function closeWithFocus() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  /* Escape closes and gives focus back; the outside pointer already chose
     its own destination, so it only closes. */

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  /* Tabbing out of the field/panel closes the panel. */

  useEffect(() => {
    if (!open) return;

    function handleFocusIn(event: FocusEvent) {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (fieldRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;

      setOpen(false);
    }

    document.addEventListener("focusin", handleFocusIn);

    return () =>
      document.removeEventListener("focusin", handleFocusIn);
  }, [open]);

  function openPanel() {
    if (disabled || readOnly) return;
    setOpen(true);
  }

  function handleTriggerClick() {
    if (disabled || readOnly) return;
    setOpen((current) => !current);
  }

  function handleTriggerKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>
  ) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();

    if (!open) {
      openPanel();
    }
  }

  function handleSelect(date: Date) {
    if (!isControlled) {
      setInternalValue(date);
    }

    onChange?.(date);
    closeWithFocus();
  }

  function handleClear() {
    if (disabled || readOnly) return;

    if (!isControlled) {
      setInternalValue(null);
    }

    onChange?.(null);
    closeWithFocus();
  }

  const showClear =
    clearable &&
    currentValue !== null &&
    currentValue !== undefined &&
    !disabled &&
    !readOnly;

  const hasValue = formattedValue !== null;

  const panelLabel =
    ariaLabel ?? label ?? "Choose a date";

  const rootClassName = [
    "pimolu-date-picker",
    fullWidth && "pimolu-date-picker--full-width",
    disabled && "pimolu-date-picker--disabled",
    readOnly && "pimolu-date-picker--read-only",
    open && "pimolu-date-picker--open",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={fieldRef} className={rootClassName}>
      {label && (
        <span
          id={labelId}
          className="pimolu-date-picker__label"
        >
          {label}

          {required && (
            <span
              className="pimolu-date-picker__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </span>
      )}

      <div className="pimolu-date-picker__field">
        <button
          ref={assignTriggerRef}
          type="button"
          id={triggerId}
          className="pimolu-date-picker__trigger"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={rendered ? panelId : undefined}
          aria-label={ariaLabel}
          aria-labelledby={
            ariaLabel
              ? undefined
              : label
                ? labelId
                : undefined
          }
          aria-describedby={hasValue ? valueId : undefined}
          aria-required={required || undefined}
          aria-readonly={readOnly || undefined}
          data-state={open ? "open" : "closed"}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
        >
          <span
            className="pimolu-date-picker__icon"
            aria-hidden="true"
          >
            <CalendarIcon />
          </span>

          <span
            id={valueId}
            className={[
              "pimolu-date-picker__value",
              !hasValue &&
                "pimolu-date-picker__value--placeholder",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {formattedValue ?? placeholder}
          </span>
        </button>

        {showClear && (
          <button
            type="button"
            className="pimolu-date-picker__clear"
            aria-label={clearLabel ?? "Clear date"}
            onClick={handleClear}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>

      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue ? isoDate(currentValue) : ""}
          disabled={disabled}
        />
      )}

      {rendered && (
        <Portal anchorRef={triggerRef}>
          <div
            ref={setPanelRef}
            id={panelId}
            role="dialog"
            aria-label={panelLabel}
            tabIndex={-1}
            className="pimolu-date-picker__panel"
            style={panelStyle}
            data-state={state}
            data-side={side}
          >
            <Calendar
              mode="single"
              selected={currentValue}
              onSelect={handleSelect}
              min={min}
              max={max}
              disabledDates={disabledDates}
              weekStartsOn={weekStartsOn}
              locale={locale}
              aria-label={panelLabel}
            />
          </div>
        </Portal>
      )}
    </div>
  );
});

DatePicker.displayName = "PimoluDatePicker";
