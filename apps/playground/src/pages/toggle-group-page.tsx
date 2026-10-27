import { CustomizationExample } from "./toggle-group-customization-demo";
import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ToggleGroup,
  ToggleGroupItem,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function ControlledSingleGroup() {
  const [alignment, setAlignment] = useState("left");

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Badge variant="primary">{alignment}</Badge>

        <span className="pg-meta">
          value is controlled by the page
        </span>
      </div>

      <ToggleGroup
        type="single"
        aria-label="Text alignment"
        value={alignment}
        onValueChange={setAlignment}
      >
        <ToggleGroupItem value="left">
          Left
        </ToggleGroupItem>

        <ToggleGroupItem value="center">
          Center
        </ToggleGroupItem>

        <ToggleGroupItem value="right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function ControlledMultipleGroup() {
  const [formats, setFormats] = useState<string[]>([
    "bold",
  ]);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        {formats.length === 0 ? (
          <Badge variant="neutral">none</Badge>
        ) : (
          formats.map((format) => (
            <Badge key={format} variant="secondary">
              {format}
            </Badge>
          ))
        )}
      </div>

      <ToggleGroup
        type="multiple"
        aria-label="Text formatting"
        value={formats}
        onValueChange={setFormats}
      >
        <ToggleGroupItem value="bold">
          Bold
        </ToggleGroupItem>

        <ToggleGroupItem value="italic">
          Italic
        </ToggleGroupItem>

        <ToggleGroupItem value="underline">
          Underline
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function ToggleGroupPage() {
  return (
    <>
      <PageHeader
        title="ToggleGroup"
        hint="A set of Toggle buttons sharing one variant and size. Single mode keeps one value, multiple mode keeps a list, and every item keeps its own aria-pressed state. Styles come from @pimolu/web-styles/toggle-group.css."
      />

      <Section
        title="Single"
        hint="type='single' with a controlled value; clicking the selected item keeps it selected."
      >
        <ControlledSingleGroup />
      </Section>

      <Section
        title="Multiple"
        hint="type='multiple' with a controlled list; every item toggles independently."
      >
        <ControlledMultipleGroup />
      </Section>

      <Section
        title="Variants and sizes"
        hint="The group passes its variant and size to every item."
      >
        <div className="pg-stack">
          {(["default", "outline", "ghost"] as const).map(
            (variant) => (
              <div key={variant} className="pg-row">
                <span className="pg-meta">{variant}</span>

                <ToggleGroup
                  type="multiple"
                  aria-label={`${variant} formatting`}
                  variant={variant}
                  size="sm"
                >
                  <ToggleGroupItem value="bold">
                    Bold
                  </ToggleGroupItem>

                  <ToggleGroupItem value="italic">
                    Italic
                  </ToggleGroupItem>

                  <ToggleGroupItem value="underline">
                    Underline
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )
          )}

          <div className="pg-row">
            <span className="pg-meta">lg</span>

            <ToggleGroup
              type="multiple"
              aria-label="Large formatting"
              variant="outline"
              size="lg"
            >
              <ToggleGroupItem value="bold">
                Bold
              </ToggleGroupItem>

              <ToggleGroupItem value="italic">
                Italic
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </Section>

      <Section
        title="Orientation and disabled"
        hint="Vertical stacks the items; the group or a single item can be disabled."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Vertical</CardTitle>
              <CardDescription>
                The items stretch to the width of the group.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ToggleGroup
                type="single"
                defaultValue="comfortable"
                orientation="vertical"
                variant="outline"
                aria-label="Density"
              >
                <ToggleGroupItem value="compact">
                  Compact
                </ToggleGroupItem>

                <ToggleGroupItem value="comfortable">
                  Comfortable
                </ToggleGroupItem>

                <ToggleGroupItem value="spacious">
                  Spacious
                </ToggleGroupItem>
              </ToggleGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disabled</CardTitle>
              <CardDescription>
                Every item is disabled by the group.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ToggleGroup
                type="multiple"
                disabled
                aria-label="Disabled formatting"
              >
                <ToggleGroupItem value="bold">
                  Bold
                </ToggleGroupItem>

                <ToggleGroupItem value="italic">
                  Italic
                </ToggleGroupItem>
              </ToggleGroup>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
