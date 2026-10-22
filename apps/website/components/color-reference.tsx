"use client";

import { useState } from "react";
import { Button, Select, SegmentedControl, usePimoluTheme } from "@pimolu/react";
import { presetNames } from "@/lib/preferences";
import { paletteFor, paletteTokens } from "@/lib/palettes";
import type { PimoluStylePreset } from "@pimolu/react";

export function ColorReference() {
  const { stylePreset, resolvedTheme } = usePimoluTheme();
  const [preset, setPreset] = useState<PimoluStylePreset>(stylePreset);
  const [mode, setMode] = useState<"light" | "dark">(resolvedTheme);
  const [message, setMessage] = useState("");
  const palette = paletteFor(preset, mode);
  async function copy(token: string) {
    try {
      await navigator.clipboard.writeText(`var(--pimolu-${token})`);
      setMessage(`Copied --pimolu-${token}`);
    } catch { setMessage("Copy unavailable. Select the variable name below the color."); }
  }
  return <div className="color-reference">
    <div className="color-reference-controls">
      <Select label="Preview palette" value={preset} onValueChange={(value) => setPreset(value as PimoluStylePreset)}>
        {presetNames.map((name) => <option key={name} value={name}>{name}</option>)}
      </Select>
      <SegmentedControl aria-label="Palette color mode" value={mode} onValueChange={(value) => setMode(value as "light" | "dark")} options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
    </div>
    <div className="color-reference-grid">
      {paletteTokens.map((token) => <div className="color-token" key={token}>
        <div className="color-token-swatch" style={{ background: palette[token] }} aria-hidden="true" />
        <div className="color-token-description"><strong>{token}</strong><span>{palette[token]}</span></div>
        <code>--pimolu-{token}</code>
        <Button size="sm" appearance="ghost" variant="neutral" onClick={() => copy(token)} aria-label={`Copy ${token} CSS variable`}>Copy variable <span aria-hidden="true">↗</span></Button>
      </div>)}
    </div>
    <p className="text-sm text-muted" role="status" aria-live="polite">{message || "Explore without changing the site. Copy a semantic variable to use in your CSS."}</p>
  </div>;
}
