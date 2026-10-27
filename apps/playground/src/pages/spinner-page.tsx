import { CustomizationExample } from "./spinner-customization-demo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Spinner,
} from "@pimolu/react";

import {
  spinnerAppearances,
  spinnerSizes,
  spinnerVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

const operations = [
  { label: "Uploading…", variant: "primary" },
  { label: "Syncing…", variant: "secondary" },
  { label: "Indexing…", variant: "warning" },
] as const;

export function SpinnerPage() {
  return (
    <>
      <PageHeader
        title="Spinner"
        hint="An indicator for an operation in progress. Appearances, sizes and variants are enumerated from spinnerVariantMap; the styles come from @pimolu/web-styles/spinner.css."
      />

      <Section
        title="Appearances"
        hint="circular, dots and arc."
      >
        <div className="pg-row">
          {spinnerAppearances.map((appearance) => (
            <div key={appearance} className="pg-demo-item">
              <Spinner appearance={appearance} size="lg" />
              <span className="pg-meta">{appearance}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sizes" hint="xs to xl.">
        <div className="pg-row">
          {spinnerSizes.map((size) => (
            <div key={size} className="pg-demo-item">
              <Spinner size={size}  />
              <span className="pg-meta">{size}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="inherit takes the current text color; the others use a semantic token."
      >
        <div className="pg-row">
          {spinnerVariants.map((variant) => (
            <div key={variant} className="pg-demo-item">
              <Spinner variant={variant} size="lg" />
              <span className="pg-meta">{variant}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Saving a form</CardTitle>
              <CardDescription>
                A decorative spinner inside a disabled button:
                it inherits the button&apos;s text color and is not
                announced twice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                type="button"
                disabled
                className="pg-inline-button"
              >
                <Spinner
                  decorative
                  size="sm"
                  variant="inherit"
                />
                Saving…
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loading a list</CardTitle>
              <CardDescription>
                Without decorative, the spinner exposes
                role=&quot;status&quot; and an accessible label.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Spinner label="Loading users…" size="lg" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>
                Decorative spinners next to visible labels, one
                semantic tone per operation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                {operations.map((operation) => (
                  <div key={operation.label} className="pg-row">
                    <Spinner
                      decorative
                      size="sm"
                      variant={operation.variant}
                    />
                    <span>{operation.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
