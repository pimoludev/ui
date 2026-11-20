"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CodeBlock,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  PageHeader,
  PimoluProvider,
  SegmentedControl,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type PimoluDensity,
  type PimoluRadius,
  type PimoluStylePreset,
} from "@pimolu/react";
import { pimoluPresets } from "@pimolu/themes/presets";
import { Link } from "@/components/ui";

const presetNames = ["default", ...Object.keys(pimoluPresets)] as PimoluStylePreset[];

const presetLabels: Record<PimoluStylePreset, string> = {
  default: "Default",
  adaptive: "Adaptive",
  cartoon: "Cartoon",
  glass: "Glass",
  luxury: "Luxury",
  monochrome: "Monochrome",
  "neo-brutalism": "Neo-brutalism",
};

const radiusOptions = [
  { value: "sharp", label: "Sharp" },
  { value: "medium", label: "Medium" },
  { value: "round", label: "Round" },
];

const densityOptions = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

const HEX = /^#[0-9a-f]{6}$/i;

function channels(hex: string) {
  return [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
}

function luminance(hex: string) {
  const [r, g, b] = channels(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string) {
  const high = Math.max(luminance(a), luminance(b));
  const low = Math.min(luminance(a), luminance(b));
  return (high + 0.05) / (low + 0.05);
}

function mixHex(hex: string, target: string, amount: number) {
  const from = channels(hex);
  const to = channels(target);
  return `#${from
    .map((channel, index) =>
      Math.round(channel + (to[index] - channel) * amount)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function IdentityKit() {
  const [preset, setPreset] = useState<PimoluStylePreset>("default");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [radius, setRadius] = useState<PimoluRadius>("medium");
  const [density, setDensity] = useState<PimoluDensity>("comfortable");
  const [brandColor, setBrandColor] = useState("#4f46e5");
  const [hexDraft, setHexDraft] = useState("#4f46e5");
  const hexValid = HEX.test(hexDraft);

  const onWhite = contrastRatio(brandColor, "#ffffff");
  const onBlack = contrastRatio(brandColor, "#000000");
  const primaryForeground = onWhite >= onBlack ? "#ffffff" : "#000000";
  const bestContrast = Math.max(onWhite, onBlack);
  const contrastVerdict =
    bestContrast >= 4.5
      ? "passes AA for normal text"
      : bestContrast >= 3
        ? "passes only large text and non-text contrast"
        : "fails the 3:1 minimum";

  const hoverLight = mixHex(brandColor, "#000000", 0.12);
  const hoverDark = mixHex(brandColor, "#ffffff", 0.12);

  const cssExport = useMemo(
    () => `/* Pimolu Identity Kit: ${presetLabels[preset]} */
/* Load this file after @pimolu/web-styles/styles.css. */
[data-pimolu-theme="light"][data-pimolu-style],
[data-pimolu-theme="system"][data-pimolu-style] {
  --pimolu-primary: ${brandColor};
  --pimolu-primary-hover: ${hoverLight};
  --pimolu-primary-foreground: ${primaryForeground};
  --pimolu-focus-ring: ${brandColor};
}

[data-pimolu-theme="dark"][data-pimolu-style] {
  --pimolu-primary: ${brandColor};
  --pimolu-primary-hover: ${hoverDark};
  --pimolu-primary-foreground: ${primaryForeground};
  --pimolu-focus-ring: ${brandColor};
}

@media (prefers-color-scheme: dark) {
  [data-pimolu-theme="system"][data-pimolu-style] {
    --pimolu-primary: ${brandColor};
    --pimolu-primary-hover: ${hoverDark};
    --pimolu-primary-foreground: ${primaryForeground};
    --pimolu-focus-ring: ${brandColor};
  }
}`,
    [preset, brandColor, hoverLight, hoverDark, primaryForeground],
  );

  const jsonExport = useMemo(
    () =>
      JSON.stringify(
        {
          stylePreset: preset,
          theme,
          radius,
          density,
          brandColor,
          primaryForeground,
        },
        null,
        2,
      ),
    [preset, theme, radius, density, brandColor, primaryForeground],
  );

  const usageExport = `import { Button, PimoluProvider } from "@pimolu/react";
import "@pimolu/web-styles/styles.css";
import "./identity.css";

export function App() {
  return (
    <PimoluProvider
      theme="${theme}"
      stylePreset="${preset}"
      radius="${radius}"
      density="${density}"
      brandColor="${brandColor}"
    >
      <Button>Make it yours</Button>
    </PimoluProvider>
  );
}`;

  function updateHex(value: string) {
    setHexDraft(value);
    const next = value.startsWith("#") ? value : `#${value}`;
    if (HEX.test(next)) setBrandColor(next.toLowerCase());
  }

  function reset() {
    setPreset("default");
    setTheme("light");
    setRadius("medium");
    setDensity("comfortable");
    setBrandColor("#4f46e5");
    setHexDraft("#4f46e5");
  }

  return (
    <>
      <div className="identity-kit-intro">
        <PageHeader
          eyebrow="Identity Kit"
          title="Brand in. System out."
          description="Start from a real Pimolu preset. Adjust the brand colour, corners and density, preview actual components, then export the result as CSS variables or JSON."
        />
        <p className="identity-kit-intro-note">
          A source-workspace tool: it generates an override for your application and does not add a
          second theming API to the published packages. Read the{" "}
          <Link href="/docs/theming" variant="muted">theming guide</Link> before adopting a brand
          colour in production.
        </p>
      </div>

      <div className="identity-kit-layout">
        <section className="identity-kit-controls" aria-labelledby="identity-kit-controls-title">
          <div className="identity-kit-controls-head">
            <h2 id="identity-kit-controls-title">Your identity</h2>
            <Button appearance="ghost" size="sm" onClick={reset}>
              Reset
            </Button>
          </div>

          <div className="identity-kit-field">
            <Label htmlFor="identity-kit-preset">Base preset</Label>
            <Select
              id="identity-kit-preset"
              value={preset}
              onValueChange={(value) => setPreset(value as PimoluStylePreset)}
              fullWidth
            >
              {presetNames.map((name) => (
                <option key={name} value={name}>{presetLabels[name]}</option>
              ))}
            </Select>
            <p className="identity-kit-hint">
              A preset defines the material. The brand colour and dimensions below refine it.
            </p>
          </div>

          <fieldset className="identity-kit-field">
            <legend>Colour mode preview</legend>
            <SegmentedControl
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              value={theme}
              onValueChange={(value) => setTheme(value as "light" | "dark")}
              fullWidth
            />
          </fieldset>

          <div className="identity-kit-field">
            <Label htmlFor="identity-kit-color">Brand colour</Label>
            <div className="identity-kit-color-row">
              <input
                id="identity-kit-color"
                className="identity-kit-color-input"
                type="color"
                value={brandColor}
                onChange={(event) => updateHex(event.target.value)}
                aria-label="Pick a brand colour"
              />
              <Input
                aria-label="Brand colour hex value"
                aria-invalid={!hexValid}
                value={hexDraft}
                onChange={(event) => updateHex(event.target.value)}
                spellCheck={false}
                maxLength={7}
              />
            </div>
            <p
              className="identity-kit-hint"
              role="status"
              aria-live="polite"
            >
              {brandColor} on white: {onWhite.toFixed(1)}:1. On black:{" "}
              {onBlack.toFixed(1)}:1. The best primary foreground is{" "}
              {primaryForeground === "#ffffff" ? "white" : "black"} and it {contrastVerdict}.
              Verify every hover, focus and status state in your own interface.
              {hexValid ? "" : " Enter a six-digit hex value such as #4f46e5; the preview keeps the last valid colour."}
            </p>
          </div>

          <fieldset className="identity-kit-field">
            <legend>Radius</legend>
            <SegmentedControl
              options={radiusOptions}
              value={radius}
              onValueChange={(value) => setRadius(value as PimoluRadius)}
              fullWidth
            />
          </fieldset>

          <fieldset className="identity-kit-field">
            <legend>Density</legend>
            <SegmentedControl
              options={densityOptions}
              value={density}
              onValueChange={(value) => setDensity(value as PimoluDensity)}
              fullWidth
            />
          </fieldset>
        </section>

        <section className="identity-kit-preview" aria-labelledby="identity-kit-preview-title">
          <div className="identity-kit-preview-head">
            <h2 id="identity-kit-preview-title">Live preview</h2>
            <Badge appearance="soft" variant="neutral">{presetLabels[preset]}</Badge>
          </div>

          <PimoluProvider
            theme={theme}
            stylePreset={preset}
            radius={radius}
            density={density}
            brandColor={brandColor}
            className="identity-kit-stage"
          >
            <div style={{ "--pimolu-primary-foreground": primaryForeground } as CSSProperties}>
              <div className="identity-kit-stage-columns">
                <Card appearance="outline">
                  <CardHeader>
                    <CardTitle>Invite your team</CardTitle>
                    <CardDescription>
                      These are real Pimolu controls, not a mockup.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="identity-kit-form">
                      <div className="identity-kit-field">
                        <Label htmlFor="identity-kit-email">Work email</Label>
                        <Input id="identity-kit-email" type="email" placeholder="alex@example.com" />
                      </div>
                      <div className="identity-kit-field">
                        <Label htmlFor="identity-kit-role">Role</Label>
                        <Select id="identity-kit-role" defaultValue="editor" fullWidth>
                          <option value="editor">Editor</option>
                          <option value="admin">Administrator</option>
                          <option value="viewer">Viewer</option>
                        </Select>
                      </div>
                      <Checkbox label="Send a welcome message" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter className="identity-kit-actions">
                    <Button appearance="outline">Cancel</Button>
                    <Button>Send invitation</Button>
                  </CardFooter>
                </Card>

                <div className="identity-kit-side">
                  <Card variant="primary" appearance="outline">
                    <CardHeader>
                      <CardTitle>Usage this month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="identity-kit-stat">72%</p>
                      <p className="identity-kit-stat-copy">
                        Of the team has joined. The accent follows your brand colour.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Badge variant="primary" appearance="soft">On track</Badge>
                    </CardFooter>
                  </Card>

                  <Alert
                    variant="info"
                    title="Contrast is a shared responsibility"
                    description="A brand accent can look right and still fail on hover or focus. Check the exported foreground against your surfaces."
                  />

                  <Dialog>
                    <DialogTrigger>
                      <Button appearance="outline" fullWidth>Preview an overlay</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Archive this workspace?</DialogTitle>
                        <DialogDescription>
                          It keeps its settings and becomes read-only for the team.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose>
                          <Button appearance="outline">Keep it active</Button>
                        </DialogClose>
                        <Button>Archive workspace</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </PimoluProvider>
        </section>
      </div>

      <section className="identity-kit-export" aria-labelledby="identity-kit-export-title">
        <div className="identity-kit-export-copy">
          <h2 id="identity-kit-export-title">Export your identity</h2>
          <p>
            Copy the generated override into your global CSS after{" "}
            <code>@pimolu/web-styles/styles.css</code>, and pass the same attributes to{" "}
            <code>PimoluProvider</code>. The CSS sets the brand variables on each colour theme,
            including the system preference; the JSON records the full selection.
          </p>
        </div>
        <Tabs defaultValue="css" className="identity-kit-tabs">
          <TabsList aria-label="Export format">
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>
          <TabsContent value="css">
            <CodeBlock code={cssExport} language="css" filename="identity.css" copyable />
          </TabsContent>
          <TabsContent value="json">
            <CodeBlock code={jsonExport} language="json" filename="identity.json" copyable />
          </TabsContent>
          <TabsContent value="usage">
            <CodeBlock code={usageExport} language="tsx" filename="app.tsx" copyable />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
