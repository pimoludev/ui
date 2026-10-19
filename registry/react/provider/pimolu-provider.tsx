
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { pimoluPresets } from "@pimolu/themes/presets";

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

const DEFAULT_STORAGE_KEY = "pimolu:preferences";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

interface PimoluContextValue {
  theme: PimoluThemeMode;
  resolvedTheme: PimoluTheme;
  stylePreset: PimoluStylePreset;

  /** Undefined means "whatever the preset declares". */
  radius: PimoluRadius | undefined;

  setTheme: (theme: PimoluThemeMode) => void;
  setStylePreset: (preset: PimoluStylePreset) => void;
  setRadius: (radius: PimoluRadius | undefined) => void;
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

/* Provider */

export interface PimoluProviderProps {
  children: ReactNode;

  theme?: PimoluThemeMode;
  defaultTheme?: PimoluThemeMode;

  stylePreset?: PimoluStylePreset;
  defaultStylePreset?: PimoluStylePreset;

  /** Radius axis; undefined keeps the preset's own radii. */
  radius?: PimoluRadius;
  defaultRadius?: PimoluRadius;

  onThemeChange?: (theme: PimoluThemeMode) => void;
  onStylePresetChange?: (preset: PimoluStylePreset) => void;
  onRadiusChange?: (radius: PimoluRadius | undefined) => void;

  persist?: boolean;
  storageKey?: string;

  className?: string;
}

export function PimoluProvider({
  children,

  theme: controlledTheme,
  defaultTheme,

  stylePreset: controlledStyle,
  defaultStylePreset,

  radius: controlledRadius,
  defaultRadius,

  onThemeChange,
  onStylePresetChange,
  onRadiusChange,

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
        }
      }
    } catch {
      // Storage unavailable or corrupted.
    }

    setLocalTheme(nextTheme);
    setLocalStyle(nextStyle);
    setLocalRadius(nextRadius);
    setLoadedKey(storageKey);
  }, [
    persist,
    storageKey,
    defaultTheme,
    defaultStylePreset,
    defaultRadius,
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

  const resolvedTheme: PimoluTheme =
    theme === "system"
      ? systemDark
        ? "dark"
        : "light"
      : theme;

  /* Save preferences */

  useEffect(() => {
    if (!persist || loadedKey !== storageKey) {
      return;
    }

    const preferences: {
      theme?: PimoluThemeMode;
      stylePreset?: PimoluStylePreset;
      radius?: PimoluRadius;
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
    controlledTheme,
    controlledStyle,
    controlledRadius,
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

  return (
    <PimoluContext.Provider
      value={{
        theme,
        resolvedTheme,
        stylePreset,
        radius,
        setTheme,
        setStylePreset,
        setRadius,
      }}
    >
      <div
        data-pimolu-theme={theme}
        data-pimolu-style={stylePreset}
        data-pimolu-radius={radius}
        className={className}
      >
        {children}
      </div>
    </PimoluContext.Provider>
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
