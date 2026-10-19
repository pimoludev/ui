import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Toggle,
} from "@pimolu/react";

import { toggleSizes, toggleVariants } from "../demo-data";
import { PageHeader, Section } from "../section";

function ControlledToggle() {
  const [pressed, setPressed] = useState(true);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Toggle
          pressed={pressed}
          onPressedChange={setPressed}
        >
          Bookmark
        </Toggle>

        <Badge variant={pressed ? "success" : "neutral"}>
          {pressed ? "saved" : "not saved"}
        </Badge>
      </div>

      <div className="pg-row">
        <Button
          size="sm"
          appearance="outline"
          onClick={() => setPressed((current) => !current)}
        >
          Toggle from outside
        </Button>
      </div>
    </div>
  );
}

export function TogglePage() {
  return (
    <>
      <PageHeader
        title="Toggle"
        hint="A button that keeps a pressed state. aria-pressed announces it, the state can be controlled or uncontrolled, and the visual treatment comes in default, outline and ghost variants. Styles come from @pimolu/web-styles/toggle.css."
      />

      <Section
        title="Variants"
        hint="Enumerated from toggleVariantMap. Each row shows the resting and pressed states."
      >
        <div className="pg-stack">
          {toggleVariants.map((variant) => (
            <div key={variant} className="pg-row">
              <span className="pg-meta">{variant}</span>

              <Toggle variant={variant}>
                Off
              </Toggle>

              <Toggle variant={variant} defaultPressed>
                On
              </Toggle>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Sizes"
        hint="Enumerated from toggleVariantMap: sm, md and lg."
      >
        <div className="pg-row">
          {toggleSizes.map((size) => (
            <Toggle key={size} size={size} defaultPressed>
              {size}
            </Toggle>
          ))}
        </div>
      </Section>

      <Section
        title="Controlled"
        hint="pressed and onPressedChange keep the state in the page; the button below changes it without clicking the toggle."
      >
        <ControlledToggle />
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Icon-only</CardTitle>
              <CardDescription>
                The glyph is decorative; aria-label names the
                action.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row">
                <Toggle
                  aria-label="Star this project"
                  variant="outline"
                >
                  ★
                </Toggle>

                <Toggle
                  aria-label="Mark as complete"
                  variant="outline"
                  defaultPressed
                >
                  ✓
                </Toggle>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Toolbar</CardTitle>
              <CardDescription>
                Independent toggles for text formatting; they
                can all be pressed at once.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row">
                <Toggle
                  size="sm"
                  variant="outline"
                  defaultPressed
                >
                  Bold
                </Toggle>

                <Toggle size="sm" variant="outline">
                  Italic
                </Toggle>

                <Toggle size="sm" variant="outline">
                  Code
                </Toggle>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disabled</CardTitle>
              <CardDescription>
                A disabled toggle keeps its state but cannot be
                changed.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row">
                <Toggle disabled>Off</Toggle>
                <Toggle disabled defaultPressed>
                  On
                </Toggle>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
