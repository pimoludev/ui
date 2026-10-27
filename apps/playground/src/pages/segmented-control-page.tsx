import { CustomizationExample } from "./segmented-control-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SegmentedControl,
} from "@pimolu/react";

import { segmentedControlSizes } from "../demo-data";
import { PageHeader, Section } from "../section";

const views = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "timeline", label: "Timeline" },
];

function ControlledSegmented() {
  const [view, setView] = useState("board");

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Badge variant="primary">{view}</Badge>

        <Button
          size="sm"
          appearance="ghost"
          onClick={() =>
            setView(view === "board" ? "list" : "board")
          }
        >
          Switch from outside
        </Button>
      </div>

      <SegmentedControl
        aria-label="Controlled view"
        options={views}
        value={view}
        onValueChange={setView}
      />
    </div>
  );
}

export function SegmentedControlPage() {
  return (
    <>
      <PageHeader
        title="SegmentedControl"
        hint="A compact radio group for picking one option. Arrow keys move the selection, Home and End jump to the ends, and the value can be uncontrolled, controlled or submitted through a hidden name. Styles come from @pimolu/web-styles/segmented-control.css."
      />

      <Section
        title="Basic"
        hint="The first enabled option is selected when no value is given."
      >
        <SegmentedControl
          aria-label="View"
          options={views}
        />
      </Section>

      <Section
        title="Sizes"
        hint="Enumerated from segmentedControlVariantMap: sm, md and lg."
      >
        <div className="pg-stack">
          {segmentedControlSizes.map((size) => (
            <div key={size} className="pg-row">
              <span className="pg-meta">{size}</span>

              <SegmentedControl
                aria-label={`View, ${size}`}
                options={views}
                size={size}
                defaultValue="board"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Width and orientation"
        hint="fullWidth stretches the segments; vertical stacks them into a menu."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Full width</CardTitle>
              <CardDescription>
                The segments share the available width.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SegmentedControl
                aria-label="Full width view"
                options={views}
                fullWidth
                defaultValue="board"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vertical</CardTitle>
              <CardDescription>
                Up and Down replace Left and Right.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SegmentedControl
                aria-label="Vertical view"
                options={views}
                orientation="vertical"
                defaultValue="timeline"
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Controlled and disabled"
        hint="The selected value can be changed from outside; the whole control or one option can be disabled."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Controlled</CardTitle>
              <CardDescription>
                value and onValueChange keep the selection in
                the page.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ControlledSegmented />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disabled</CardTitle>
              <CardDescription>
                The whole control and a single option.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <SegmentedControl
                  aria-label="Disabled view"
                  options={views}
                  disabled
                />

                <SegmentedControl
                  aria-label="Partly disabled view"
                  options={[
                    { value: "list", label: "List" },
                    {
                      value: "board",
                      label: "Board",
                      disabled: true,
                    },
                    { value: "timeline", label: "Timeline" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
