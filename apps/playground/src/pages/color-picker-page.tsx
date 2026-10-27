import { CustomizationExample } from "./color-picker-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ColorPicker,
  DEFAULT_COLOR_PICKER_PRESETS,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const brandPresets = DEFAULT_COLOR_PICKER_PRESETS;

function BrandStudio() {
  const [brand, setBrand] = useState("#5B55E7");
  const [accent, setAccent] = useState("#0EA5E9");

  return (
    <div className="pg-grid pg-grid--two">
      <div className="pg-stack">
        <ColorPicker
          label="Brand color"
          value={brand}
          onValueChange={setBrand}
          presets={brandPresets}
        />

        <ColorPicker
          label="Accent color"
          value={accent}
          onValueChange={setAccent}
          presets={brandPresets}
          size="sm"
        />

        <div className="pg-row">
          <Button
            type="button"
            size="sm"
            appearance="ghost"
            onClick={() => {
              setBrand("#5B55E7");
              setAccent("#0EA5E9");
            }}
          >
            Reset palette
          </Button>
        </div>
      </div>

      <div
        className="pg-panel pg-stack"
        style={{ borderTop: `4px solid ${brand}` }}
      >
        <div className="pg-row">
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 12,
              background: brand,
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            P
          </span>

          <div>
            <strong style={{ color: brand }}>
              Pimolu Studio
            </strong>

            <p className="pg-meta">
              {brand} · {accent}
            </p>
          </div>
        </div>

        <p className="pg-meta">
          A live preview of the two selected tokens. The picker
          reports uppercase #RRGGBB values.
        </p>

        <div className="pg-row">
          <Button
            type="button"
            size="sm"
            style={{
              background: brand,
              borderColor: brand,
              color: "#ffffff",
            }}
          >
            Start a project
          </Button>

          <Button
            type="button"
            size="sm"
            appearance="outline"
            style={{
              color: accent,
              borderColor: accent,
            }}
          >
            View work
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ColorPickerPage() {
  return (
    <>
      <PageHeader
        title="ColorPicker"
        hint="A controlled or uncontrolled hex color field. The trigger shows a live swatch and the value; the popover offers the native color input, a validated hex field and named presets. Values normalize to uppercase #RRGGBB, and Escape returns focus to the trigger. Styles come from @pimolu/web-styles/color-picker.css."
      />

      <Section
        title="Controlled"
        hint="value and onValueChange drive two brand tokens; the preview reacts immediately."
      >
        <Card>
          <CardHeader>
            <CardTitle>Brand palette</CardTitle>
            <CardDescription>
              Choose the primary and accent colors for a small
              product site.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <BrandStudio />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Sizes"
        hint="sm, md and lg scale the trigger, the swatch and the value together."
      >
        <div className="pg-grid pg-grid--start">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Card key={size}>
              <CardHeader>
                <CardTitle>{size}</CardTitle>
              </CardHeader>

              <CardContent>
                <ColorPicker
                  label="Surface color"
                  defaultValue="#10B981"
                  size={size}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Presets"
        hint="The presets prop accepts any readable array; invalid entries are filtered out and each swatch has an accessible name."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Custom palette</CardTitle>
              <CardDescription>
                A warm set for an editorial theme.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ColorPicker
                label="Editorial accent"
                defaultValue="#EF4444"
                presets={[
                  "#EF4444",
                  "#F59E0B",
                  "#10B981",
                  "#2563EB",
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uncontrolled</CardTitle>
              <CardDescription>
                defaultValue seeds the field; the component owns
                the next value.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ColorPicker
                label="Background"
                defaultValue="#111827"
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="States"
        hint="An external error marks the control invalid; read-only keeps the value inspectable; disabled closes every entry point."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>
                A brand color is required before publishing.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ColorPicker
                label="Brand color"
                error="Choose a brand color before publishing."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Read-only</CardTitle>
              <CardDescription>
                The palette is locked after launch.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ColorPicker
                label="Locked accent"
                defaultValue="#7C3AED"
                readOnly
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disabled</CardTitle>
              <CardDescription>
                The theme is managed by the organization.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ColorPicker
                label="Managed color"
                defaultValue="#64748B"
                disabled
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Example: theme settings"
        hint="A settings form pairs a field with a live token summary and a clear action."
      >
        <Card>
          <CardHeader>
            <CardTitle>Workspace appearance</CardTitle>
            <CardDescription>
              Personalize the dashboard. Every value is a
              #RRGGBB string, ready for the theme pipeline.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <BrandStudio />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Value contract"
        hint="The trigger and the hex field accept #RGB and #RRGGBB; onValueChange always receives the expanded uppercase form."
      >
        <div className="pg-row">
          <Badge variant="primary">#abc → #AABBCC</Badge>
          <Badge variant="success">#ffffff → #FFFFFF</Badge>
          <Badge variant="neutral">invalid → inline error</Badge>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
