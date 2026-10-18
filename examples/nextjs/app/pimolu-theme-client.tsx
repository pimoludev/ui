
"use client";

import { useState, type ReactNode } from "react";

import { PimoluProvider } from "@pimolu/react";

import type {
  PimoluThemeMode,
  PimoluStylePreset,
} from "@pimolu/react";

interface PimoluThemeClientProps {
  children: ReactNode;
  initialTheme: PimoluThemeMode;
  initialStylePreset: PimoluStylePreset;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function saveCookie(name: string, value: string) {
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${COOKIE_MAX_AGE}`,
    "SameSite=Lax",
    ...(window.location.protocol === "https:"
      ? ["Secure"]
      : []),
  ].join("; ");
}

export function PimoluThemeClient({
  children,
  initialTheme,
  initialStylePreset,
}: PimoluThemeClientProps) {
  const [theme, setTheme] =
    useState<PimoluThemeMode>(initialTheme);

  const [stylePreset, setStylePreset] =
    useState<PimoluStylePreset>(initialStylePreset);

  function handleThemeChange(nextTheme: PimoluThemeMode) {
    setTheme(nextTheme);
    saveCookie("pimolu-theme", nextTheme);
  }

  function handleStyleChange(nextStyle: PimoluStylePreset) {
    setStylePreset(nextStyle);
    saveCookie("pimolu-style", nextStyle);
  }

  return (
    <PimoluProvider
      theme={theme}
      stylePreset={stylePreset}
      onThemeChange={handleThemeChange}
      onStylePresetChange={handleStyleChange}
    >
      {children}
    </PimoluProvider>
  );
}
