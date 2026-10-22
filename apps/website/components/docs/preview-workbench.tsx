"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button, CodeBlock, Input, PimoluProvider, Select, Tabs, TabsContent, TabsList, TabsTrigger, usePimoluTheme } from "@pimolu/react";
import { customizeExample, defaultPreviewSettings, previewOptions, previewQuery, type PreviewSettings } from "@/lib/preview-settings";
import { ComponentExample } from "./component-examples";

export function PreviewWorkbench({ family, example, source, initialSettings = defaultPreviewSettings }: { family: string; example: string; source: string; initialSettings?: PreviewSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [controlsOpen, setControlsOpen] = useState(false);
  const settingsId = useId();
  const [brandInput, setBrandInput] = useState(initialSettings.brand);
  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState("");
  const [measuredWidth, setMeasuredWidth] = useState<number>();
  const surface = useRef<HTMLDivElement>(null);
  const parent = usePimoluTheme();
  useEffect(() => {
    const node = surface.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setMeasuredWidth(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  function update<K extends keyof PreviewSettings>(key: K, value: PreviewSettings[K]) { setSettings((current) => ({ ...current, [key]: value })); setMessage(""); }
  async function copyLink() {
    try {
      const url = new URL(window.location.href);
      url.search = previewQuery(settings); url.hash = "preview";
      await navigator.clipboard.writeText(url.toString()); setMessage("Preview link copied.");
    } catch { setMessage("Link could not be copied. Clipboard access is required."); }
  }
  const invalidBrand = brandInput !== "" && !/^#[0-9a-f]{6}$/i.test(brandInput);
  return <Tabs className="preview-workbench example-switcher" defaultValue="preview" variant="segmented" size="sm">
    <TabsList aria-label={`${family} example view`}><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
    <TabsContent value="preview" className="example-preview-panel">
    <div className="flex flex-wrap items-center justify-between gap-3"><Button appearance="outline" variant="neutral" aria-expanded={controlsOpen} aria-controls={settingsId} onClick={() => setControlsOpen(!controlsOpen)}>{controlsOpen ? "Hide customization" : "Customize preview"}</Button><div className="flex flex-wrap gap-3"><Button appearance="ghost" size="sm" variant="neutral" onClick={copyLink}>Copy preview link</Button><Button appearance="ghost" size="sm" variant="neutral" onClick={() => { setSettings(defaultPreviewSettings); setBrandInput(""); setRevision((value) => value + 1); setMessage("Preview reset."); }}>Reset preview</Button></div></div>
    <div id={settingsId} hidden={!controlsOpen} className="preview-settings" role="group" aria-label="Preview settings">
      <div className="preview-settings-grid">
        <Select label="Preview preset" value={settings.preset} onValueChange={(value) => update("preset", value as PreviewSettings["preset"])} fullWidth><option value="inherit">Follow site</option>{previewOptions.presets.map((value) => <option key={value}>{value}</option>)}</Select>
        <Select label="Preview color mode" value={settings.mode} onValueChange={(value) => update("mode", value as PreviewSettings["mode"])} fullWidth><option value="inherit">Follow site</option><option value="light">Light</option><option value="dark">Dark</option></Select>
        <Select label="Preview corners" value={settings.radius} onValueChange={(value) => update("radius", value as PreviewSettings["radius"])} fullWidth><option value="inherit">Preset default</option>{previewOptions.radii.map((value) => <option key={value}>{value}</option>)}</Select>
        <Select label="Preview density" value={settings.density} onValueChange={(value) => update("density", value as PreviewSettings["density"])} fullWidth><option value="inherit">Comfortable default</option>{previewOptions.densities.map((value) => <option key={value}>{value}</option>)}</Select>
        <Select label="Presentation width" value={settings.width} onValueChange={(value) => update("width", value as PreviewSettings["width"])} fullWidth><option value="full">Available width</option><option value="768">Tablet · up to 768 px</option><option value="390">Mobile · up to 390 px</option></Select>
        <Select label="Preview direction" value={settings.direction} onValueChange={(value) => update("direction", value as PreviewSettings["direction"])} fullWidth><option value="ltr">Left to right</option><option value="rtl">Right to left</option></Select>
      </div>
      <Input label="Preview brand color" placeholder="#4f46e5" value={brandInput} onValueChange={(value) => { setBrandInput(value); if (!value || /^#[0-9a-f]{6}$/i.test(value)) update("brand", value.toLowerCase()); }} maxLength={7} fullWidth helperText="Optional six-digit hex. Clear to restore the preset. Check contrast with your brand color." errorMessage={invalidBrand ? "Use a six-digit hex such as #4f46e5." : undefined} />
    </div>
    <p className="text-sm text-muted" role="status">{message || "Changes apply to this preview only."}</p>
    <div className="preview-canvas">
      <div ref={surface} className="preview-sized-surface" style={{ maxWidth: settings.width === "full" ? "100%" : `${settings.width}px` }} dir={settings.direction}>
        <PimoluProvider theme={settings.mode === "inherit" ? parent.theme : settings.mode} stylePreset={settings.preset === "inherit" ? parent.stylePreset : settings.preset} radius={settings.radius === "inherit" ? undefined : settings.radius} density={settings.density === "inherit" ? undefined : settings.density} brandColor={settings.brand || undefined}>
          <div className={`docs-preview docs-preview--${family}`}><ComponentExample key={revision} family={family} direction={settings.direction} /></div>
        </PimoluProvider>
      </div>
      <p className="preview-dimensions">{measuredWidth !== undefined ? `${measuredWidth} px available to this example` : "Width adapts to the available space"}{settings.width !== "full" ? ` · capped at ${settings.width} px` : ""}</p>
    </div>
    </TabsContent>
    <TabsContent value="code"><CodeBlock code={customizeExample(source, example, settings)} language="tsx" filename={`${family}-example.tsx`} maxHeight={520} wrap /></TabsContent>
  </Tabs>;
}
