"use client";

import { useState } from "react";
import { Button, Link, Popover, Toggle, usePimoluTheme } from "@pimolu/react";
import { presetNames } from "@/lib/preferences";
import { paletteFor, presetDescriptions } from "@/lib/palettes";

export function SiteAppearance() {
  const { resolvedTheme, theme, setTheme, stylePreset, setStylePreset } = usePimoluTheme();
  const [open, setOpen] = useState(false);
  return <div className="site-appearance">
    <Popover open={open} onOpenChange={setOpen} label="Site appearance" className="site-appearance-panel" content={
      <div className="site-appearance-content">
        <div className="site-appearance-heading"><span className="site-appearance-eyebrow">One system. Your identity.</span><h2>Find your atmosphere.</h2><p>Seven characters. Your choice of light or dark.</p></div>
        <div className="site-preset-grid" role="group" aria-label="Visual preset">
          {presetNames.map((preset) => {
            const palette = paletteFor(preset, resolvedTheme);
            return <Button key={preset} appearance="ghost" variant="neutral" className="site-preset-choice" aria-label={preset.replaceAll("-", " ")} aria-pressed={stylePreset === preset} onClick={() => setStylePreset(preset)}>
              <span className="site-preset-title"><span>{preset.replaceAll("-", " ")}</span><span className="site-preset-check" aria-hidden="true">{stylePreset === preset ? "✓" : ""}</span></span>
              <span className="site-preset-colors" aria-hidden="true">{["primary", palette.accent ? "accent" : "background", "surface", "foreground", "border"].map((token) => <span key={token} style={{ background: palette[token] }} />)}</span>
              <span className="site-preset-description">{presetDescriptions[preset]}</span>
            </Button>;
          })}
        </div>
        <div className="site-appearance-note"><p><span>Primary · {resolvedTheme}</span><code>{paletteFor(stylePreset, resolvedTheme).primary}</code></p><Link href="/docs/colors" onClick={() => setOpen(false)}>Explore all palette colors <span aria-hidden="true">→</span></Link><Button appearance="ghost" size="sm" variant="neutral" aria-pressed={theme === "system"} onClick={() => setTheme("system")}>Use device color mode</Button></div>
      </div>
    }>
      <Button className="site-icon-control" appearance="ghost" variant="neutral" iconOnly aria-label="Customize site theme" title="Customize site theme" startIcon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.4-3.4.9.9 0 0 1 .6-1.6h1a5 5 0 0 0 5-5c0-4.4-4-8-9-8Z" /><circle cx="7.5" cy="11" r=".8" /><circle cx="10" cy="7" r=".8" /><circle cx="15" cy="7.5" r=".8" /><circle cx="17" cy="11.5" r=".8" /></svg>
      } />
    </Popover>
    <Toggle className="site-icon-control" pressed={resolvedTheme === "dark"} onPressedChange={(dark) => setTheme(dark ? "dark" : "light")} aria-label="Dark mode" title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      {resolvedTheme === "dark" ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z" /></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>}
    </Toggle>
  </div>;
}
