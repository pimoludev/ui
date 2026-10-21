"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";

import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { Input } from "../input/input";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { Select } from "../select/select";

import {
  DEFAULT_THEME_BUILDER_BRAND_COLOR,
  themeBuilderDensityOptions,
  themeBuilderRadiusOptions,
  type PimoluThemeBuilderProps,
  type PimoluThemeBuilderTheme,
} from "./theme-builder.types";

export type {
  PimoluThemeBuilderPreset,
  PimoluThemeBuilderProps,
  PimoluThemeBuilderTheme,
} from "./theme-builder.types";

export {
  DEFAULT_THEME_BUILDER_BRAND_COLOR,
  themeBuilderDensityOptions,
  themeBuilderRadiusOptions,
} from "./theme-builder.types";

/* =========================================
   CONTROLLABLE STATE
========================================= */

interface ControllableState<T> {
  value: T;
  setValue: (next: T) => void;
  setInternalValue: Dispatch<SetStateAction<T>>;
  isControlled: boolean;
}

function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T
): ControllableState<T> {
  const [internalValue, setInternalValue] =
    useState(defaultValue);

  const isControlled = controlled !== undefined;

  return {
    value: isControlled
      ? (controlled as T)
      : internalValue,

    setValue(next) {
      if (!isControlled) setInternalValue(next);
    },

    setInternalValue,
    isControlled,
  };
}

/* =========================================
   COLOUR HELPERS
========================================= */

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function normalizeHex(value: string) {
  const trimmed = value.trim();

  if (!HEX_COLOR.test(trimmed)) return null;

  const hex = trimmed.slice(1);

  const expanded =
    hex.length === 3
      ? hex
          .split("")
          .map((character) => character + character)
          .join("")
      : hex;

  return `#${expanded.toUpperCase()}`;
}

function mixHex(
  hex: string,
  target: string,
  amount: number
) {
  const parse = (value: string) =>
    [1, 3, 5].map((index) =>
      parseInt(value.slice(index, index + 2), 16)
    );

  const from = parse(hex);
  const to = parse(target);

  return `#${from
    .map((channel, index) =>
      Math.round(
        channel + (to[index] - channel) * amount
      )
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

/* =========================================
   DEFAULTS
========================================= */

const FALLBACK_SWATCHES = [
  "var(--pimolu-primary)",
  "var(--pimolu-secondary, var(--pimolu-success))",
  "var(--pimolu-foreground)",
  "var(--pimolu-muted)",
] as const;

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

function DefaultPreview() {
  return (
    <div className="pimolu-theme-builder__sample">
      <div className="pimolu-theme-builder__sample-head">
        <span className="pimolu-theme-builder__eyebrow">
          Live preview
        </span>

        <Badge
          variant="primary"
          appearance="soft"
          size="sm"
        >
          Tokens applied
        </Badge>
      </div>

      <p className="pimolu-theme-builder__sample-title">
        A small surface, every token.
      </p>

      <p className="pimolu-theme-builder__sample-copy">
        Buttons, fields and badges follow the palette,
        radius and density you pick.
      </p>

      <div className="pimolu-theme-builder__sample-actions">
        <Button size="sm">Primary action</Button>

        <Button size="sm" appearance="outline">
          Secondary
        </Button>
      </div>

      <Input
        label="Email address"
        placeholder="you@example.com"
        size="sm"
        fullWidth
      />
    </div>
  );
}

/* =========================================
   THEME BUILDER
========================================= */

export const ThemeBuilder = forwardRef<
  HTMLDivElement,
  PimoluThemeBuilderProps
>(function ThemeBuilder(
  {
    presets,

    value,
    defaultValue,
    onValueChange,

    theme,
    onThemeChange,

    brandColor,
    onBrandColorChange,

    radius,
    onRadiusChange,

    density,
    onDensityChange,

    preview,
    title,

    className,
    ...props
  },
  ref
) {
  const presetLabelId = useId();
  const themeLabelId = useId();
  const colorId = useId();

  const presetState = useControllableState(
    value,
    defaultValue ?? presets[0]?.id ?? ""
  );

  const themeState =
    useControllableState<PimoluThemeBuilderTheme>(
      theme,
      "light"
    );

  const brandState = useControllableState(
    brandColor,
    DEFAULT_THEME_BUILDER_BRAND_COLOR
  );

  const radiusState = useControllableState(
    radius,
    "medium"
  );

  const densityState = useControllableState(
    density,
    "comfortable"
  );

  const presetRefs = useRef<
    Array<HTMLButtonElement | null>
  >([]);

  const presetId = presetState.value;
  const currentTheme = themeState.value;
  const currentBrand = brandState.value;
  const currentRadius = radiusState.value;
  const currentDensity = densityState.value;

  const selectedPreset = presets.find(
    (entry) => entry.id === presetId
  );

  /* A preset list that loads after mount still selects its first entry. */
  useEffect(() => {
    if (presetState.isControlled) return;

    if (
      presets.some((entry) => entry.id === presetId)
    ) {
      return;
    }

    const next = presets[0]?.id ?? "";

    if (next !== presetId) {
      presetState.setInternalValue(next);
    }
  }, [
    presets,
    presetId,
    presetState.isControlled,
    presetState.setInternalValue,
  ]);

  function selectPreset(nextId: string) {
    if (nextId === presetId) return;

    presetState.setValue(nextId);
    onValueChange?.(nextId);
  }

  function handlePresetKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (presets.length === 0) return;

    const { key } = event;

    if (
      key !== "ArrowRight" &&
      key !== "ArrowDown" &&
      key !== "ArrowLeft" &&
      key !== "ArrowUp" &&
      key !== "Home" &&
      key !== "End"
    ) {
      return;
    }

    event.preventDefault();

    const currentIndex = presets.findIndex(
      (entry) => entry.id === presetId
    );

    let nextIndex: number;

    if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = presets.length - 1;
    } else if (key === "ArrowRight" || key === "ArrowDown") {
      nextIndex =
        currentIndex < 0
          ? 0
          : (currentIndex + 1) % presets.length;
    } else {
      nextIndex =
        currentIndex < 0
          ? presets.length - 1
          : (currentIndex - 1 + presets.length) %
            presets.length;
    }

    const next = presets[nextIndex];

    presetRefs.current[nextIndex]?.focus();
    selectPreset(next.id);
  }

  function handleThemeChange(nextValue: string) {
    if (nextValue !== "light" && nextValue !== "dark") {
      return;
    }

    if (nextValue === currentTheme) return;

    themeState.setValue(nextValue);
    onThemeChange?.(nextValue);
  }

  function handleBrandChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextValue = event.currentTarget.value;

    brandState.setValue(nextValue);
    onBrandColorChange?.(nextValue);
  }

  function handleRadiusChange(nextValue: string) {
    if (nextValue === currentRadius) return;

    radiusState.setValue(nextValue);
    onRadiusChange?.(nextValue);
  }

  function handleDensityChange(nextValue: string) {
    if (nextValue === currentDensity) return;

    densityState.setValue(nextValue);
    onDensityChange?.(nextValue);
  }

  const normalizedBrand = normalizeHex(currentBrand);

  /* The preview consumes the documented token overrides, not provider
     internals: a parent can wire the same values into PimoluProvider. */
  const previewStyle = normalizedBrand
    ? ({
        "--pimolu-primary": normalizedBrand,

        "--pimolu-primary-hover": mixHex(
          normalizedBrand,
          currentTheme === "dark" ? "#ffffff" : "#000000",
          0.12
        ),

        "--pimolu-focus-ring": normalizedBrand,
      } as CSSProperties)
    : undefined;

  return (
    <div
      {...props}
      ref={ref}
      className={[
        "pimolu-theme-builder",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title && (
        <div className="pimolu-theme-builder__header">
          <h3 className="pimolu-theme-builder__title">
            {title}
          </h3>

          <Badge
            className="pimolu-theme-builder__summary"
            variant="neutral"
            appearance="soft"
            size="sm"
            aria-live="polite"
          >
            {[
              selectedPreset?.label ?? presetId,
              currentTheme === "dark" ? "Dark" : "Light",
            ]
              .filter(Boolean)
              .join(" · ")}
          </Badge>
        </div>
      )}

      <div className="pimolu-theme-builder__layout">
        <div className="pimolu-theme-builder__controls">
          <div className="pimolu-theme-builder__field">
            <span
              id={presetLabelId}
              className="pimolu-theme-builder__label"
            >
              Style preset
            </span>

            <div
              role="radiogroup"
              aria-labelledby={presetLabelId}
              className="pimolu-theme-builder__presets"
              onKeyDown={handlePresetKeyDown}
            >
              {presets.map((preset, index) => {
                const selected = preset.id === presetId;

                const swatches =
                  preset.colors && preset.colors.length > 0
                    ? preset.colors.slice(0, 5)
                    : FALLBACK_SWATCHES;

                return (
                  <button
                    key={preset.id}
                    ref={(node) => {
                      presetRefs.current[index] = node;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={
                      selected ||
                      (!selectedPreset && index === 0)
                        ? 0
                        : -1
                    }
                    className="pimolu-theme-builder__preset"
                    data-state={
                      selected ? "selected" : "idle"
                    }
                    onClick={() => selectPreset(preset.id)}
                  >
                    <span
                      className="pimolu-theme-builder__swatches"
                      aria-hidden="true"
                    >
                      {swatches.map((color, swatchIndex) => (
                        <span
                          key={`${color}-${swatchIndex}`}
                          className="pimolu-theme-builder__swatch"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      ))}
                    </span>

                    <span className="pimolu-theme-builder__preset-label">
                      {preset.label}
                    </span>

                    {preset.description && (
                      <span className="pimolu-theme-builder__preset-description">
                        {preset.description}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pimolu-theme-builder__field">
            <span
              id={themeLabelId}
              className="pimolu-theme-builder__label"
            >
              Color mode
            </span>

            <SegmentedControl
              aria-labelledby={themeLabelId}
              options={THEME_OPTIONS}
              value={currentTheme}
              size="sm"
              fullWidth
              onValueChange={handleThemeChange}
            />
          </div>

          <div className="pimolu-theme-builder__field">
            <label
              htmlFor={colorId}
              className="pimolu-theme-builder__label"
            >
              Brand color
            </label>

            <div className="pimolu-theme-builder__color-row">
              <input
                id={colorId}
                type="color"
                className="pimolu-theme-builder__color-input"
                value={
                  normalizedBrand ??
                  DEFAULT_THEME_BUILDER_BRAND_COLOR
                }
                onChange={handleBrandChange}
              />

              <span className="pimolu-theme-builder__color-value">
                {normalizedBrand ?? currentBrand}
              </span>
            </div>
          </div>

          <div className="pimolu-theme-builder__selects">
            <Select
              label="Radius"
              value={currentRadius}
              fullWidth
              onValueChange={handleRadiusChange}
            >
              {themeBuilderRadiusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              label="Density"
              value={currentDensity}
              fullWidth
              onValueChange={handleDensityChange}
            >
              {themeBuilderDensityOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <section
          className="pimolu-theme-builder__preview"
          aria-label="Theme preview"
          data-pimolu-theme={currentTheme}
          data-pimolu-style={presetId || undefined}
          data-pimolu-radius={currentRadius || undefined}
          data-pimolu-density={currentDensity || undefined}
          style={previewStyle}
        >
          {preview ?? <DefaultPreview />}
        </section>
      </div>
    </div>
  );
});

ThemeBuilder.displayName = "PimoluThemeBuilder";
