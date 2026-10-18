
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

const DEFAULT_STORAGE_KEY = "pimolu:preferences";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

interface PimoluContextValue {
  theme: PimoluThemeMode;
  resolvedTheme: PimoluTheme;
  stylePreset: PimoluStylePreset;
  setTheme: (theme: PimoluThemeMode) => void;
  setStylePreset: (preset: PimoluStylePreset) => void;
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

/* Provider */

export interface PimoluProviderProps {
  children: ReactNode;

  theme?: PimoluThemeMode;
  defaultTheme?: PimoluThemeMode;

  stylePreset?: PimoluStylePreset;
  defaultStylePreset?: PimoluStylePreset;

  onThemeChange?: (theme: PimoluThemeMode) => void;
  onStylePresetChange?: (preset: PimoluStylePreset) => void;

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

  onThemeChange,
  onStylePresetChange,

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
        }
      }
    } catch {
      // Storage unavailable or corrupted.
    }

    setLocalTheme(nextTheme);
    setLocalStyle(nextStyle);
    setLoadedKey(storageKey);
  }, [
    persist,
    storageKey,
    defaultTheme,
    defaultStylePreset,
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
    } = {};

    if (controlledTheme === undefined) {
      preferences.theme = theme;
    }

    if (controlledStyle === undefined) {
      preferences.stylePreset = stylePreset;
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
    controlledTheme,
    controlledStyle,
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

  return (
    <PimoluContext.Provider
      value={{
        theme,
        resolvedTheme,
        stylePreset,
        setTheme,
        setStylePreset,
      }}
    >
      <div
        data-pimolu-theme={theme}
        data-pimolu-style={stylePreset}
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
