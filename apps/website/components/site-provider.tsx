"use client";

import { useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { PimoluProvider, type PimoluStylePreset, type PimoluThemeMode } from "@pimolu/react";
import { preferenceCookie, presetCookie, themeCookie } from "@/lib/preferences";

export function SiteProvider({ children, initialTheme, initialPreset }: {
  children: ReactNode;
  initialTheme: PimoluThemeMode;
  initialPreset: PimoluStylePreset;
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [preset, setPreset] = useState(initialPreset);
  function save(name: string, value: string) {
    document.cookie = preferenceCookie(name, value, location.protocol === "https:");
  }
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.16 }}>
      <PimoluProvider className="site-root" theme={theme} stylePreset={preset}
        onThemeChange={(value) => { setTheme(value); save(themeCookie, value); }}
        onStylePresetChange={(value) => { setPreset(value); save(presetCookie, value); }}>
        {children}
      </PimoluProvider>
    </MotionConfig>
  );
}
