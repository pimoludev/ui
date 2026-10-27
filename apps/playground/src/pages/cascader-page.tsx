import { CustomizationExample } from "./cascader-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Cascader,
  type PimoluCascaderOption,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const regions: PimoluCascaderOption[] = [
  {
    value: "europe",
    label: "Europe",
    children: [
      {
        value: "france",
        label: "France",
        children: [
          { value: "paris", label: "Paris" },
          { value: "lyon", label: "Lyon" },
          { value: "bordeaux", label: "Bordeaux" },
        ],
      },
      {
        value: "germany",
        label: "Germany",
        children: [
          { value: "berlin", label: "Berlin" },
          { value: "munich", label: "Munich" },
        ],
      },
      {
        value: "spain",
        label: "Spain",
        children: [
          { value: "madrid", label: "Madrid" },
          { value: "barcelona", label: "Barcelona" },
        ],
      },
    ],
  },
  {
    value: "north-america",
    label: "North America",
    children: [
      {
        value: "canada",
        label: "Canada",
        children: [
          { value: "montreal", label: "Montréal" },
          { value: "toronto", label: "Toronto" },
        ],
      },
      {
        value: "united-states",
        label: "United States",
        children: [
          { value: "new-york", label: "New York" },
          { value: "san-francisco", label: "San Francisco" },
        ],
      },
    ],
  },
  {
    value: "asia",
    label: "Asia",
    children: [
      {
        value: "japan",
        label: "Japan",
        children: [
          { value: "tokyo", label: "Tokyo" },
          { value: "osaka", label: "Osaka" },
        ],
      },
      {
        value: "singapore",
        label: "Singapore",
        children: [
          { value: "singapore-city", label: "Singapore" },
        ],
      },
    ],
  },
];

function LongLocationsExample() {
  const [path, setPath] = useState<readonly string[]>([]);
  const options = Array.from({ length: 36 }, (_, index) => ({
    value: `region-${index + 1}`, label: `Region ${index + 1}`,
    children: [{ value: `city-${index + 1}`, label: `City ${index + 1}` }],
  }));
  return <div className="pg-stack">
    <Cascader label="Delivery region" options={options} value={path} onChange={setPath} fullWidth />
    <p role="status">Selected path: {path.join(" / ") || "none"}.</p>
  </div>;
}

function ControlledDestination() {
  const [path, setPath] = useState<string[]>([
    "europe",
    "france",
    "paris",
  ]);

  return (
    <div className="pg-stack">
      <Cascader
        label="Destination"
        options={regions}
        value={path}
        onChange={(nextPath) => setPath(nextPath)}
        helperText="Hover or click a branch to open the next column."
        fullWidth
      />

      <div className="pg-row">
        <Badge variant="primary">
          {path.length === 0
            ? "Nothing selected"
            : path.join(" / ")}
        </Badge>

        <Button
          size="sm"
          appearance="ghost"
          onClick={() =>
            setPath(["north-america", "canada", "montreal"])
          }
        >
          Move to Montréal
        </Button>

        <Button
          size="sm"
          appearance="ghost"
          onClick={() => setPath([])}
          disabled={path.length === 0}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

function ShippingExample() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <div className="pg-stack">
      <Cascader
        label="Shipping destination"
        placeholder="Country, then city"
        options={regions}
        value={path}
        onChange={(nextPath) => setPath(nextPath)}
        fullWidth
      />

      <p className="pg-copy">
        {path.length === 0
          ? "Choose a region to estimate the delivery window."
          : `Delivery to ${path
              .slice(-1)
              .join("")} is estimated at 2–4 business days.`}
      </p>
    </div>
  );
}

export function CascaderPage() {
  return (
    <>
      <PageHeader
        title="Cascader"
        hint="A hierarchical single-select rendered as columns of levels in a portal panel. Selection is a path, so the same component works for regions, product categories or file systems."
      />

      <Section
        title="Basic"
        hint="Click a branch to expand it, then choose a leaf. The trigger shows the full path."
      >
        <Cascader
          label="Region"
          placeholder="Select a region"
          options={regions}
          fullWidth
        />
      </Section>

      <Section
        title="Controlled"
        hint="value is the path from the root; onChange receives the path and its option."
      >
        <Card>
          <CardHeader>
            <CardTitle>Destination</CardTitle>
            <CardDescription>
              The badge mirrors the controlled path.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ControlledDestination />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="States"
        hint="Disabled, helper text, clearable, a pre-selected default and an empty data set."
      >
        <div className="pg-stack">
          <Cascader
            label="With helper text"
            options={regions}
            helperText="Hover a branch with children to open it."
            fullWidth
          />

          <Cascader
            label="Pre-selected"
            options={regions}
            defaultValue={[
              "asia",
              "japan",
              "tokyo",
            ]}
            fullWidth
          />

          <Cascader
            label="Not clearable"
            options={regions}
            defaultValue={[
              "north-america",
              "united-states",
              "new-york",
            ]}
            clearable={false}
            fullWidth
          />

          <Cascader
            label="Disabled"
            options={regions}
            defaultValue={[
              "europe",
              "germany",
              "berlin",
            ]}
            disabled
            fullWidth
          />

          <Cascader
            label="Empty"
            options={[]}
            emptyMessage="No regions have been configured."
            fullWidth
          />
        </div>
      </Section>

      <Section title="Long lists and touch scrolling" hint="Scroll the region column with a finger. A completed tap expands a branch; only mouse hover opens columns before a click.">
        <LongLocationsExample />
      </Section>

      <Section
        title="Examples"
        hint="Two concrete uses of the same path-based control."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Delivery estimate</CardTitle>
              <CardDescription>
                A controlled cascader feeding a summary line.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ShippingExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace location</CardTitle>
              <CardDescription>
                The default value opens with its columns already
                expanded.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Cascader
                label="Office"
                options={regions}
                defaultValue={[
                  "europe",
                  "spain",
                  "barcelona",
                ]}
                helperText="Used for holidays and payroll."
                fullWidth
              />
            </CardContent>

            <CardFooter>
              <Badge variant="success">
                Remote-friendly
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
