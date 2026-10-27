"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import type {
  PimoluColorPickerProps,
} from "./color-picker.types";

import { Popover } from "../popover/popover";

/* =========================================
   DEFAULTS
======================================== */

/** Default hex color. */
export const DEFAULT_COLOR_PICKER_VALUE = "#5B55E7";

/** Cross-theme defaults for the preset row. */
export const DEFAULT_COLOR_PICKER_PRESETS: readonly string[] = [
  "#5B55E7",
  "#4338CA",
  "#8B5CF6",
  "#A855F7",
  "#0EA5E9",
  "#2563EB",
  "#06B6D4",
  "#14B8A6",
  "#10B981",
  "#22C55E",
  "#84CC16",
  "#F59E0B",
  "#F97316",
  "#EAB308",
  "#EF4444",
  "#F43F5E",
  "#EC4899",
  "#D946EF",
  "#64748B",
  "#111827",
  "#78716C",
  "#D1D5DB",
  "#000000",
  "#FFFFFF",
];

const HEX_COLOR_PATTERN =
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const INVALID_HEX_MESSAGE =
  "Use a 3- or 6-digit hex color, for example #5B55E7.";

/* =========================================
   HELPERS
======================================== */

/**
 * Normalizes `#RGB` or `#RRGGBB` to an uppercase `#RRGGBB` string.
 * Returns null when the value is not a hex color.
 */
export function normalizeHexColor(
  value: string
): string | null {
  const match = HEX_COLOR_PATTERN.exec(value.trim());

  if (!match) return null;

  let hex = match[1];

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((character) => character + character)
      .join("");
  }

  return `#${hex.toUpperCase()}`;
}

function resolveColor(value: string | undefined) {
  return (
    normalizeHexColor(value ?? "") ??
    DEFAULT_COLOR_PICKER_VALUE
  );
}

/* =========================================
   COLOR PICKER
======================================== */

export const ColorPicker = forwardRef<
  HTMLDivElement,
  PimoluColorPickerProps
>(function ColorPicker(
  { classNames,
    value,
    defaultValue,
    onValueChange,

    presets = DEFAULT_COLOR_PICKER_PRESETS,

    disabled = false,
    readOnly = false,
    label,
    error,
    size = "md",

    className,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("color-picker", classNames, true);

  const generatedId = useId();
  const labelId = `pimolu-color-picker-${generatedId}-label`;
  const valueId = `pimolu-color-picker-${generatedId}-value`;
  const errorId = `pimolu-color-picker-${generatedId}-error`;
  const hexErrorId = `pimolu-color-picker-${generatedId}-hex-error`;
  const hintId = `pimolu-color-picker-${generatedId}-hint`;
  const presetsTitleId = `pimolu-color-picker-${generatedId}-presets-title`;

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(
    () => resolveColor(defaultValue)
  );

  const normalizedValue = isControlled
    ? resolveColor(value)
    : internalValue;

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(normalizedValue);
  const [hexError, setHexError] = useState<string | null>(
    null
  );

  const hasError = Boolean(error);

  const presetColors = Array.from(
    new Set(
      presets
        .map((preset) => normalizeHexColor(preset))
        .filter((preset): preset is string => Boolean(preset))
    )
  );

  /* Refresh the text field whenever the panel is closed. */

  useEffect(() => {
    if (open) return;

    setDraft(normalizedValue);
    setHexError(null);
  }, [normalizedValue, open]);

  function commit(nextColor: string) {
    const normalized = normalizeHexColor(nextColor);

    if (!normalized) return null;

    if (normalized !== normalizedValue) {
      if (!isControlled) {
        setInternalValue(normalized);
      }

      onValueChange?.(normalized);
    }

    return normalized;
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setDraft(normalizedValue);
      setHexError(null);
    }
  }

  function closeAndReturnFocus() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleHexChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const next = event.currentTarget.value;

    setDraft(next);
    setHexError(null);

    /* Commit as soon as a complete six-digit value is typed. */
    if (/^#[0-9a-fA-F]{6}$/.test(next.trim())) {
      commit(next);
    }
  }

  function handleHexBlur() {
    if (readOnly) return;

    const normalized = normalizeHexColor(draft);

    if (normalized) {
      commit(normalized);
      setDraft(normalized);
      setHexError(null);
    } else {
      setHexError(INVALID_HEX_MESSAGE);
    }
  }

  function handleHexKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const normalized = normalizeHexColor(draft);

    if (!normalized) {
      setHexError(INVALID_HEX_MESSAGE);
      return;
    }

    commit(normalized);
    setDraft(normalized);
    closeAndReturnFocus();
  }

  function handleNativeColorChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const normalized = normalizeHexColor(
      event.currentTarget.value
    );

    if (!normalized) return;

    commit(normalized);
    setDraft(normalized);
    setHexError(null);
  }

  function selectPreset(preset: string) {
    if (readOnly || disabled) return;

    commit(preset);
    closeAndReturnFocus();
  }

  const triggerLabelledBy = label
    ? `${labelId} ${valueId}`
    : undefined;

  return scopeParts((
    <div
      {...props}
      ref={ref}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={hasError || undefined}
      className={mergeClasses([
        "pimolu-color-picker",
        `pimolu-color-picker--${size}`,
        disabled && "pimolu-color-picker--disabled",
        readOnly && "pimolu-color-picker--readonly",
        hasError && "pimolu-color-picker--invalid",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
    >
      {label && (
        <span
          id={labelId}
          className={mergeClasses("pimolu-color-picker__label", partClasses.label)}
        >
          {label}
        </span>
      )}

      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        disabled={disabled}
        padding="none"
        className={mergeClasses("pimolu-color-picker__panel", partClasses.panel)}
        label={
          label ? `${label} picker` : "Color picker"
        }
        content={
          <>
            <div className={mergeClasses("pimolu-color-picker__field-row", partClasses.fieldRow)}>
              <label className={mergeClasses("pimolu-color-picker__custom", partClasses.custom)}>
                <input
                  type="color"
                  className={mergeClasses("pimolu-color-picker__native", partClasses.native)}
                  aria-label="Pick a color"
                  value={normalizedValue.toLowerCase()}
                  disabled={disabled || readOnly}
                  onChange={handleNativeColorChange}
                />
                <span>Any color</span>
              </label>

              <input
                type="text"
                className={mergeClasses("pimolu-color-picker__hex", partClasses.hex)}
                aria-label="Hex color"
                value={draft}
                readOnly={readOnly}
                disabled={disabled}
                spellCheck={false}
                autoComplete="off"
                aria-invalid={hexError ? true : undefined}
                aria-describedby={[hintId, hexError ? hexErrorId : null]
                  .filter(Boolean)
                  .join(" ")}
                onChange={handleHexChange}
                onBlur={handleHexBlur}
                onKeyDown={handleHexKeyDown}
              />
            </div>

            <p
              id={hintId}
              className={mergeClasses("pimolu-color-picker__hint", partClasses.hint)}
            >
              Pick any color or enter a 3- or 6-digit hex value.
            </p>

            {hexError && (
              <p
                id={hexErrorId}
                className={mergeClasses("pimolu-color-picker__hex-error", partClasses.hexError)}
                role="alert"
              >
                {hexError}
              </p>
            )}

            <div className={mergeClasses("pimolu-color-picker__presets-group", partClasses.presetsGroup)}>
              <span
                id={presetsTitleId}
                className={mergeClasses("pimolu-color-picker__presets-title", partClasses.presetsTitle)}
              >
                Presets
              </span>

              <div
                role="group"
                aria-labelledby={presetsTitleId}
                className={mergeClasses("pimolu-color-picker__presets", partClasses.presets)}
              >
                {presetColors.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={mergeClasses("pimolu-color-picker__preset", partClasses.preset)}
                    style={{ backgroundColor: preset }}
                    aria-label={`Use color ${preset}`}
                    aria-pressed={
                      preset === normalizedValue
                    }
                    disabled={disabled || readOnly}
                    onClick={() => selectPreset(preset)}
                  />
                ))}
              </div>
            </div>
          </>
        }
      >
        <button
          ref={triggerRef}
          type="button"
          className={mergeClasses("pimolu-color-picker__trigger", partClasses.trigger)}
          disabled={disabled}
          aria-label={
            label
              ? undefined
              : `Choose a color: ${normalizedValue}`
          }
          aria-labelledby={triggerLabelledBy}
          aria-describedby={
            hasError ? errorId : undefined
          }
          aria-invalid={hasError || undefined}
          aria-readonly={readOnly || undefined}
        >
          <span
            className={mergeClasses("pimolu-color-picker__swatch", partClasses.swatch)}
            style={{
              backgroundColor: normalizedValue,
            }}
            aria-hidden="true"
          />

          <span
            id={valueId}
            className={mergeClasses("pimolu-color-picker__value", partClasses.value)}
          >
            {normalizedValue}
          </span>
        </button>
      </Popover>

      {hasError && (
        <p
          id={errorId}
          className={mergeClasses("pimolu-color-picker__error", partClasses.error)}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  ));
});

ColorPicker.displayName = "PimoluColorPicker";
