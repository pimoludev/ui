
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

import { pimoluPresets } from "@pimolu/themes/presets";
import { AnimationScope, PimoluAnimationProvider, type PimoluAnimationEngine } from "../animation/animation-engine";

import type {
  PimoluTheme,
  PimoluStylePreset,
} from "@pimolu/themes/presets";

export type {
  PimoluTheme,
  PimoluStylePreset,
} from "@pimolu/themes/presets";

export type PimoluThemeMode = PimoluTheme | "system";

export type PimoluRadius = "sharp" | "medium" | "round";

export type PimoluDensity =
  | "compact"
  | "comfortable"
  | "spacious";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** Mixes a hex colour towards another one, for a derived hover tone. */
function mixHex(
  hex: string,
  target: string,
  amount: number
): string {
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

const DEFAULT_STORAGE_KEY = "pimolu:preferences";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

interface PimoluContextValue {
  theme: PimoluThemeMode;
  resolvedTheme: PimoluTheme;
  stylePreset: PimoluStylePreset;

  /** Undefined means "whatever the preset declares". */
  radius: PimoluRadius | undefined;

  /** Undefined means "the comfortable default". */
  density: PimoluDensity | undefined;

  /** Brand primary, or undefined to keep the preset's. */
  brandColor: string | undefined;

  setTheme: (theme: PimoluThemeMode) => void;
  setStylePreset: (preset: PimoluStylePreset) => void;
  setRadius: (radius: PimoluRadius | undefined) => void;
  setDensity: (density: PimoluDensity | undefined) => void;
  setBrandColor: (color: string | undefined) => void;
}

const PimoluContext = createContext<PimoluContextValue | null>(
  null
);

/* System theme */

function subscribeSystemTheme(callback: () => void) {
  if (
    typeof window === "undefined" ||
    !window.matchMedia
  ) {
    return () => {};
  }

  const media = window.matchMedia(MEDIA_QUERY);

  media.addEventListener("change", callback);

  return () => media.removeEventListener("change", callback);
}

function getSystemTheme() {
  if (
    typeof window === "undefined" ||
    !window.matchMedia
  ) {
    return false;
  }

  return window.matchMedia(MEDIA_QUERY).matches;
}

function getServerTheme() {
  return false;
}

/* Stored preference validation */

function isThemeMode(value: unknown): value is PimoluThemeMode {
  return (
    value === "light" ||
    value === "dark" ||
    value === "system"
  );
}

function isStylePreset(
  value: unknown
): value is PimoluStylePreset {
  return (
    typeof value === "string" &&
    (
      value === "default" ||
      Object.prototype.hasOwnProperty.call(
        pimoluPresets,
        value
      )
    )
  );
}

function isRadius(
  value: unknown
): value is PimoluRadius {
  return (
    value === "sharp" ||
    value === "medium" ||
    value === "round"
  );
}

function isDensity(
  value: unknown
): value is PimoluDensity {
  return (
    value === "compact" ||
    value === "comfortable" ||
    value === "spacious"
  );
}

/* Provider */

export interface PimoluProviderProps {
  /** Omit to inherit; defaults to CSS. Supply an optional driver, e.g. motionEngine. */
  animationEngine?: "css" | PimoluAnimationEngine;
  children: ReactNode;

  theme?: PimoluThemeMode;
  defaultTheme?: PimoluThemeMode;

  stylePreset?: PimoluStylePreset;
  defaultStylePreset?: PimoluStylePreset;

  /** Radius axis; undefined keeps the preset's own radii. */
  radius?: PimoluRadius;
  defaultRadius?: PimoluRadius;

  /** Density axis; undefined keeps the comfortable default. */
  density?: PimoluDensity;
  defaultDensity?: PimoluDensity;

  /**
   * Brand colour as a #RRGGBB string. It overrides primary,
   * primary-hover (derived) and the focus ring; undefined keeps
   * the preset's own primary.
   */
  brandColor?: string;

  onThemeChange?: (theme: PimoluThemeMode) => void;
  onStylePresetChange?: (preset: PimoluStylePreset) => void;
  onRadiusChange?: (radius: PimoluRadius | undefined) => void;
  onDensityChange?: (
    density: PimoluDensity | undefined
  ) => void;
  onBrandColorChange?: (color: string | undefined) => void;

  persist?: boolean;
  storageKey?: string;

  className?: string;
}

export function PimoluProvider({
  animationEngine,
  children,

  theme: controlledTheme,
  defaultTheme,

  stylePreset: controlledStyle,
  defaultStylePreset,

  radius: controlledRadius,
  defaultRadius,

  density: controlledDensity,
  defaultDensity,

  brandColor: controlledBrand,

  onThemeChange,
  onStylePresetChange,
  onRadiusChange,
  onDensityChange,
  onBrandColorChange,

  persist = false,
  storageKey = DEFAULT_STORAGE_KEY,

  className,
}: PimoluProviderProps) {
  const parent = useContext(PimoluContext);

  const [localTheme, setLocalTheme] =
    useState<PimoluThemeMode | undefined>(defaultTheme);

  const [localStyle, setLocalStyle] =
    useState<PimoluStylePreset | undefined>(
      defaultStylePreset
    );

  const [localRadius, setLocalRadius] =
    useState<PimoluRadius | undefined>(defaultRadius);

  const [localDensity, setLocalDensity] =
    useState<PimoluDensity | undefined>(defaultDensity);

  const [localBrand, setLocalBrand] = useState<
    string | undefined
  >();

  const [loadedKey, setLoadedKey] =
    useState<string | null>(null);

  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    getServerTheme
  );

  /* Load preferences */

  useEffect(() => {
    if (!persist) {
      setLoadedKey(null);
      return;
    }

    let nextTheme = defaultTheme;
    let nextStyle = defaultStylePreset;
    let nextRadius = defaultRadius;
    let nextDensity = defaultDensity;

    try {
      const raw = window.localStorage.getItem(storageKey);

      if (raw) {
        const saved: unknown = JSON.parse(raw);

        if (saved && typeof saved === "object") {
          const values = saved as Record<string, unknown>;

          if (isThemeMode(values.theme)) {
            nextTheme = values.theme;
          }

          if (isStylePreset(values.stylePreset)) {
            nextStyle = values.stylePreset;
          }

          if (isRadius(values.radius)) {
            nextRadius = values.radius;
          }

          if (isDensity(values.density)) {
            nextDensity = values.density;
          }
        }
      }
    } catch {
      // Storage unavailable or corrupted.
    }

    setLocalTheme(nextTheme);
    setLocalStyle(nextStyle);
    setLocalRadius(nextRadius);
    setLocalDensity(nextDensity);
    setLoadedKey(storageKey);
  }, [
    persist,
    storageKey,
    defaultTheme,
    defaultStylePreset,
    defaultRadius,
    defaultDensity,
  ]);

  /* Resolve values */

  const theme =
    controlledTheme ??
    localTheme ??
    parent?.theme ??
    "light";

  const stylePreset =
    controlledStyle ??
    localStyle ??
    parent?.stylePreset ??
    "default";

  const radius =
    controlledRadius ??
    localRadius ??
    parent?.radius;

  const density =
    controlledDensity ??
    localDensity ??
    parent?.density;

  const brandColor =
    controlledBrand ??
    localBrand ??
    parent?.brandColor;

  const resolvedTheme: PimoluTheme =
    theme === "system"
      ? systemDark
        ? "dark"
        : "light"
      : theme;

  /* The brand colour only overrides what a brand owns: the primary
     tone, its hover (derived) and the focus ring. */

  const brandStyle =
    brandColor !== undefined && HEX_COLOR.test(brandColor)
      ? ({
          "--pimolu-primary": brandColor,

          "--pimolu-primary-hover": mixHex(
            brandColor,
            resolvedTheme === "dark" ? "#ffffff" : "#000000",
            0.12
          ),

          "--pimolu-focus-ring": brandColor,
        } as CSSProperties)
      : undefined;

  /* Save preferences */

  useEffect(() => {
    if (!persist || loadedKey !== storageKey) {
      return;
    }

    const preferences: {
      theme?: PimoluThemeMode;
      stylePreset?: PimoluStylePreset;
      radius?: PimoluRadius;
      density?: PimoluDensity;
    } = {};

    if (controlledTheme === undefined) {
      preferences.theme = theme;
    }

    if (controlledStyle === undefined) {
      preferences.stylePreset = stylePreset;
    }

    if (
      controlledRadius === undefined &&
      radius !== undefined
    ) {
      preferences.radius = radius;
    }

    if (
      controlledDensity === undefined &&
      density !== undefined
    ) {
      preferences.density = density;
    }

    if (Object.keys(preferences).length === 0) {
      return;
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(preferences)
      );
    } catch {
      // Storage is optional.
    }
  }, [
    persist,
    loadedKey,
    storageKey,
    theme,
    stylePreset,
    radius,
    density,
    controlledTheme,
    controlledStyle,
    controlledRadius,
    controlledDensity,
  ]);

  /* Public setters */

  function setTheme(value: PimoluThemeMode) {
    if (controlledTheme === undefined) {
      setLocalTheme(value);
    }

    onThemeChange?.(value);
  }

  function setStylePreset(value: PimoluStylePreset) {
    if (controlledStyle === undefined) {
      setLocalStyle(value);
    }

    onStylePresetChange?.(value);
  }

  function setRadius(value: PimoluRadius | undefined) {
    if (controlledRadius === undefined) {
      setLocalRadius(value);
    }

    onRadiusChange?.(value);
  }

  function setDensity(value: PimoluDensity | undefined) {
    if (controlledDensity === undefined) {
      setLocalDensity(value);
    }

    onDensityChange?.(value);
  }

  function setBrandColor(value: string | undefined) {
    if (controlledBrand === undefined) {
      setLocalBrand(value);
    }

    onBrandColorChange?.(value);
  }

  return (
    <PimoluAnimationProvider engine={animationEngine} scope={false}>
    <PimoluContext.Provider
      value={{
        theme,
        resolvedTheme,
        stylePreset,
        radius,
        density,
        brandColor,
        setTheme,
        setStylePreset,
        setRadius,
        setDensity,
        setBrandColor,
      }}
    >
      <div
        data-pimolu-theme={theme}
        data-pimolu-style={stylePreset}
        data-pimolu-radius={radius}
        data-pimolu-density={density}
        style={brandStyle}
        className={className}
      >
        <AnimationScope>{children}</AnimationScope>
      </div>
    </PimoluContext.Provider>
    </PimoluAnimationProvider>
  );
}

/* Public hook */

export function usePimoluTheme() {
  const context = useContext(PimoluContext);

  if (!context) {
    throw new Error(
      "usePimoluTheme must be used inside PimoluProvider"
    );
  }

  return context;
}
