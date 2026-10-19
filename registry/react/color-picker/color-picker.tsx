"use client";

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
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#111827",
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
  {
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

  return (
    <div
      {...props}
      ref={ref}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={hasError || undefined}
      className={[
        "pimolu-color-picker",
        `pimolu-color-picker--${size}`,
        disabled && "pimolu-color-picker--disabled",
        readOnly && "pimolu-color-picker--readonly",
        hasError && "pimolu-color-picker--invalid",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <span
          id={labelId}
          className="pimolu-color-picker__label"
        >
          {label}
        </span>
      )}

      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        disabled={disabled}
        padding="none"
        className="pimolu-color-picker__panel"
        label={
          label ? `${label} picker` : "Color picker"
        }
        content={
          <>
            <div className="pimolu-color-picker__field-row">
              <input
                type="color"
                className="pimolu-color-picker__native"
                aria-label="Pick a color"
                value={normalizedValue.toLowerCase()}
                disabled={disabled || readOnly}
                onChange={handleNativeColorChange}
              />

              <input
                type="text"
                className="pimolu-color-picker__hex"
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
              className="pimolu-color-picker__hint"
            >
              Enter a 3- or 6-digit hex value.
            </p>

            {hexError && (
              <p
                id={hexErrorId}
                className="pimolu-color-picker__hex-error"
                role="alert"
              >
                {hexError}
              </p>
            )}

            <div className="pimolu-color-picker__presets-group">
              <span
                id={presetsTitleId}
                className="pimolu-color-picker__presets-title"
              >
                Presets
              </span>

              <div
                role="group"
                aria-labelledby={presetsTitleId}
                className="pimolu-color-picker__presets"
              >
                {presetColors.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="pimolu-color-picker__preset"
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
          className="pimolu-color-picker__trigger"
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
            className="pimolu-color-picker__swatch"
            style={{
              backgroundColor: normalizedValue,
            }}
            aria-hidden="true"
          />

          <span
            id={valueId}
            className="pimolu-color-picker__value"
          >
            {normalizedValue}
          </span>
        </button>
      </Popover>

      {hasError && (
        <p
          id={errorId}
          className="pimolu-color-picker__error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

ColorPicker.displayName = "PimoluColorPicker";
