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

import type {
  PimoluDateRange,
  PimoluDateRangePickerProps,
  PimoluDateRangePreset,
} from "./date-range-picker.types";

import { Calendar } from "../calendar/calendar";
import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import { usePresence } from "../internal/use-presence";

/* =========================================
   HELPERS
========================================= */

/** Must match the exit animation duration in date-range-picker.css. */
const EXIT_DURATION = 120;

const EMPTY_RANGE: PimoluDateRange = {
  from: null,
  to: null,
};

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function dayNumber(date: Date): number {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return dayNumber(a) === dayNumber(b);
}

function daysBetween(a: Date, b: Date): number {
  return Math.round(
    (dayNumber(b) - dayNumber(a)) / 86_400_000
  );
}

function normalizeRange(range: PimoluDateRange): PimoluDateRange {
  const from = range.from ? startOfDay(range.from) : null;
  const to = range.to ? startOfDay(range.to) : null;

  if (from && to && daysBetween(from, to) < 0) {
    return { from: to, to: from };
  }

  return { from, to };
}

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
   DATE RANGE PICKER
========================================= */

export const DateRangePicker = forwardRef<
  HTMLButtonElement,
  PimoluDateRangePickerProps
>(function DateRangePicker(
  {
    id,
    name,

    value,
    defaultValue = EMPTY_RANGE,
    onChange,

    placeholder = "Select date range",
    label,

    min,
    max,
    disabledDates,
    presets,

    numberOfMonths = 2,

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
    id ?? `pimolu-date-range-picker-${generatedId}`;

  const labelId = `${triggerId}-label`;
  const valueId = `${triggerId}-value`;
  const panelId = `${triggerId}-panel`;

  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;

  const [internalRange, setInternalRange] =
    useState<PimoluDateRange>(() =>
      normalizeRange(defaultValue ?? EMPTY_RANGE)
    );

  const [open, setOpen] = useState(false);

  const currentRange = normalizeRange(
    isControlled ? value : internalRange
  );

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
      maxHeight: 560,
      maxWidth: 760,
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
        month: "short",
        day: "numeric",
      }),
    [locale]
  );

  const from = currentRange.from;
  const to = currentRange.to;

  const formattedFrom = from
    ? dateFormatter.format(from)
    : null;

  const formattedTo = to
    ? dateFormatter.format(to)
    : null;

  const formattedValue =
    formattedFrom && formattedTo
      ? isSameDay(from as Date, to as Date)
        ? formattedFrom
        : `${formattedFrom} – ${formattedTo}`
      : formattedFrom
        ? `From ${formattedFrom}`
        : formattedTo
          ? `Until ${formattedTo}`
          : null;

  const selectedDays =
    from && to
      ? daysBetween(from, to) + 1
      : 0;

  const summary =
    from && to
      ? `${selectedDays} ${
          selectedDays === 1 ? "day" : "days"
        } selected`
      : from
        ? "Select an end date."
        : "Select a start date.";

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

  function commitRange(nextRange: PimoluDateRange) {
    const normalized = normalizeRange(nextRange);

    if (!isControlled) {
      setInternalRange(normalized);
    }

    onChange?.(normalized);

    return normalized;
  }

  function handleRangeChange(nextRange: PimoluDateRange) {
    const normalized = commitRange(nextRange);

    if (normalized.from && normalized.to) {
      closeWithFocus();
    }
  }

  function handlePreset(preset: PimoluDateRangePreset) {
    const normalized = commitRange(preset.range);

    if (normalized.from && normalized.to) {
      closeWithFocus();
    }
  }

  function handleClear() {
    if (disabled || readOnly) return;

    commitRange(EMPTY_RANGE);
    closeWithFocus();
  }

  const hasValue = from !== null || to !== null;

  const showClear =
    clearable && hasValue && !disabled && !readOnly;

  const panelLabel =
    ariaLabel ?? label ?? "Choose a date range";

  const rootClassName = [
    "pimolu-date-range-picker",
    fullWidth && "pimolu-date-range-picker--full-width",
    disabled && "pimolu-date-range-picker--disabled",
    readOnly && "pimolu-date-range-picker--read-only",
    open && "pimolu-date-range-picker--open",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={fieldRef} className={rootClassName}>
      {label && (
        <span
          id={labelId}
          className="pimolu-date-range-picker__label"
        >
          {label}

          {required && (
            <span
              className="pimolu-date-range-picker__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </span>
      )}

      <div className="pimolu-date-range-picker__field">
        <button
          ref={assignTriggerRef}
          type="button"
          id={triggerId}
          className="pimolu-date-range-picker__trigger"
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
            className="pimolu-date-range-picker__icon"
            aria-hidden="true"
          >
            <CalendarIcon />
          </span>

          <span
            id={valueId}
            className={[
              "pimolu-date-range-picker__value",
              !hasValue &&
                "pimolu-date-range-picker__value--placeholder",
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
            className="pimolu-date-range-picker__clear"
            aria-label={clearLabel ?? "Clear date range"}
            onClick={handleClear}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>

      {name && (
        <>
          <input
            type="hidden"
            name={name}
            value={from ? isoDate(from) : ""}
            disabled={disabled}
          />

          <input
            type="hidden"
            name={`${name}-end`}
            value={to ? isoDate(to) : ""}
            disabled={disabled}
          />
        </>
      )}

      {rendered && (
        <Portal anchorRef={triggerRef}>
          <div
            ref={setPanelRef}
            id={panelId}
            role="dialog"
            aria-label={panelLabel}
            tabIndex={-1}
            className="pimolu-date-range-picker__panel"
            style={panelStyle}
            data-state={state}
            data-side={side}
          >
            <div className="pimolu-date-range-picker__body">
              {presets && presets.length > 0 && (
                <div
                  className="pimolu-date-range-picker__presets"
                  role="group"
                  aria-label="Date range presets"
                >
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="pimolu-date-range-picker__preset"
                      onClick={() => handlePreset(preset)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              <Calendar
                mode="range"
                range={currentRange}
                onRangeChange={handleRangeChange}
                min={min}
                max={max}
                disabledDates={disabledDates}
                weekStartsOn={weekStartsOn}
                locale={locale}
                numberOfMonths={numberOfMonths}
                aria-label={panelLabel}
              />
            </div>

            <div className="pimolu-date-range-picker__footer">
              <span
                className="pimolu-date-range-picker__summary"
                aria-live="polite"
              >
                {summary}
              </span>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
});

DateRangePicker.displayName = "PimoluDateRangePicker";
