import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Code,
  ThemeBuilder,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const presets = [
  {
    id: "default",
    label: "Default",
    description: "Balanced indigo with soft depth.",
    colors: ["#4F46E5", "#818CF8", "#E0E7FF", "#F8FAFC"],
  },
  {
    id: "monochrome",
    label: "Monochrome",
    description: "Ink, paper and a single accent.",
    colors: ["#171717", "#525252", "#D4D4D4", "#FAFAFA"],
  },
  {
    id: "cartoon",
    label: "Cartoon",
    description: "Playful colour and confident outlines.",
    colors: ["#FF5C8A", "#FFD166", "#06D6A0", "#118AB2"],
  },
  {
    id: "glass",
    label: "Glass",
    description: "Translucent surfaces and cool light.",
    colors: ["#38BDF8", "#A5B4FC", "#E0F2FE", "#F8FAFC"],
  },
  {
    id: "luxury",
    label: "Luxury",
    description: "Warm neutrals, gold and quiet contrast.",
    colors: ["#926A35", "#E8CF9B", "#241F1A", "#FAF6EF"],
  },
  {
    id: "neo-brutalism",
    label: "Neo-brutalism",
    description: "Hard edges, offset shadows, loud accents.",
    colors: ["#FFE600", "#FF5C8A", "#171717", "#FFFFFF"],
  },
];

const builderUsage = `<ThemeBuilder
  presets={presets}
  value={preset}
  onValueChange={setPreset}
  theme={theme}
  onThemeChange={setTheme}
  brandColor={brandColor}
  onBrandColorChange={setBrandColor}
  radius={radius}
  onRadiusChange={setRadius}
  density={density}
  onDensityChange={setDensity}
/>`;

const providerUsage = `<PimoluProvider
  theme={theme}
  stylePreset={preset}
  brandColor={brandColor}
  radius={radius}
  density={density}
>
  <App />
</PimoluProvider>`;

function ControlledBuilder() {
  const [preset, setPreset] = useState("default");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [brandColor, setBrandColor] = useState("#5B55E7");
  const [radius, setRadius] = useState("medium");
  const [density, setDensity] = useState("comfortable");

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Badge variant="primary" appearance="soft">
          {preset}
        </Badge>

        <Badge variant="neutral" appearance="soft">
          {theme}
        </Badge>

        <Badge variant="neutral" appearance="soft">
          radius: {radius}
        </Badge>

        <Badge variant="neutral" appearance="soft">
          density: {density}
        </Badge>

        <span className="pg-meta">{brandColor}</span>
      </div>

      <ThemeBuilder
        title="Build your theme"
        presets={presets}
        value={preset}
        onValueChange={setPreset}
        theme={theme}
        onThemeChange={setTheme}
        brandColor={brandColor}
        onBrandColorChange={setBrandColor}
        radius={radius}
        onRadiusChange={setRadius}
        density={density}
        onDensityChange={setDensity}
      />
    </div>
  );
}

export function ThemeBuilderPage() {
  return (
    <>
      <PageHeader
        title="ThemeBuilder"
        hint="A presentational theme customizer for a documentation site: preset cards with palette swatches, a light/dark control, a brand colour input, and radius and density selects, with a live preview scope. State is owned by the page; the component never reads provider internals."
      />

      <Section
        title="Controlled theme builder"
        hint="Every control is lifted into page state here, which is the recommended integration for a settings panel. The preview applies the documented data-pimolu-* attributes and a local primary-token override."
      >
        <ControlledBuilder />
      </Section>

      <Section
        title="Custom preview"
        hint="Supply any ReactNode as preview. It renders inside the themed preview scope, so Pimolu components pick up the selected preset, colour mode, radius, density and brand colour."
      >
        <ThemeBuilder
          title="Appearance"
          presets={presets}
          defaultValue="glass"
          preview={
            <Card className="pg-panel">
              <CardHeader>
                <div className="pg-row pg-row--between">
                  <div>
                    <CardTitle>Atlas Cloud</CardTitle>
                    <CardDescription>
                      A project workspace inside the selected theme.
                    </CardDescription>
                  </div>

                  <Badge variant="success" appearance="soft">
                    Active
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="pg-row">
                  <Button size="sm">Create project</Button>

                  <Button size="sm" appearance="outline">
                    Invite teammate
                  </Button>
                </div>
              </CardContent>
            </Card>
          }
        />
      </Section>

      <Section
        title="Integration"
        hint="ThemeBuilder stays a controlled view or owns its fallback state. Wire the same values into PimoluProvider when the choice must reach the rest of the application."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Builder state</CardTitle>
              <CardDescription>
                Pass the callbacks your settings page already owns.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Code block>{builderUsage}</Code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Provider wiring</CardTitle>
              <CardDescription>
                The same four dimensions are public provider props.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Code block>{providerUsage}</Code>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Example: documentation appearance panel"
        hint="An uncontrolled builder is useful for a quick demo; pass defaultValue to start on a specific preset."
      >
        <ThemeBuilder
          title="Documentation appearance"
          presets={presets}
          defaultValue="default"
        />
      </Section>
    </>
  );
}
