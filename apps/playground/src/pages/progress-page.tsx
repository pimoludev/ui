import { CustomizationExample } from "./progress-customization-demo";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Slider,
} from "@pimolu/react";

import {
  progressSizes,
  progressVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

/* A real composition: the slider drives the progress tone. */

function StorageUsage() {
  const [used, setUsed] = useState(72);

  const variant =
    used >= 90
      ? "danger"
      : used >= 75
        ? "warning"
        : "primary";

  return (
    <div className="pg-stack">
      <Progress
        label="Storage used"
        value={used}
        showValue
        variant={variant}
        formatValue={(value, max) =>
          `${value} Go of ${max} Go`
        }
        valueLabel={`${used} gigabytes used of 100`}
      />

      <Slider
        label="Simulate usage"
        min={0}
        max={100}
        value={used}
        onValueChange={setUsed}
        showValue
        formatValue={(value) => `${value} Go`}
      />
    </div>
  );
}

export function ProgressPage() {
  return (
    <>
      <PageHeader
        title="Progress"
        hint="Completion of a task, determinate or not. Sizes and variants are enumerated from progressVariantMap; the styles come from @pimolu/web-styles/progress.css."
      />

      <Section
        title="Sizes"
        hint="The size drives the track height and the gap."
      >
        <div className="pg-grid pg-grid--start">
          {progressSizes.map((size) => (
            <div key={size} className="pg-demo-item">
              <Progress
                label={`Size ${size}`}
                size={size}
                value={60}
              />
              <span className="pg-meta">{size}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The variant sets the tone of the filled part."
      >
        <div className="pg-grid pg-grid--start">
          {progressVariants.map((variant) => (
            <div key={variant} className="pg-demo-item">
              <Progress
                label={`Variant ${variant}`}
                variant={variant}
                value={70}
              />
              <span className="pg-meta">{variant}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="States"
        hint="Determinate, indeterminate, formatted, clamped."
      >
        <div className="pg-grid pg-grid--start">
          <div className="pg-demo-item">
            <Progress
              label="Indeterminate"
              showValue
            />
            <span className="pg-meta">
              no value → aria-valuenow omitted
            </span>
          </div>

          <div className="pg-demo-item">
            <Progress
              label="With readout"
              value={42}
              showValue
            />
            <span className="pg-meta">showValue</span>
          </div>

          <div className="pg-demo-item">
            <Progress
              label="Step 3 of 8"
              value={3}
              max={8}
              showValue
              formatValue={(value, max) =>
                `${value} / ${max}`
              }
            />
            <span className="pg-meta">formatValue</span>
          </div>

          <div className="pg-demo-item">
            <Progress
              label="Clamped"
              value={140}
              variant="warning"
              showValue
            />
            <span className="pg-meta">value above max</span>
          </div>

          <div className="pg-demo-item">
            <Progress
              label="Custom maximum"
              value={5}
              max={20}
              showValue
            />
            <span className="pg-meta">max 20</span>
          </div>

          <div className="pg-demo-item">
            <Progress
              value={65}
              aria-label="Indexing documents"
              variant="secondary"
            />
            <span className="pg-meta">aria-label only</span>
          </div>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Upload</CardTitle>
              <CardDescription>
                A determinate bar with a spoken value and a
                readable percentage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                label="design-system.zip"
                value={68}
                showValue
                valueLabel="68 percent uploaded"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding</CardTitle>
              <CardDescription>
                Steps rather than a percentage, in a compact
                size.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                label="Workspace setup"
                value={3}
                max={6}
                size="sm"
                showValue
                formatValue={(value, max) =>
                  `Step ${value} of ${max}`
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage</CardTitle>
              <CardDescription>
                The tone follows the usage: primary, warning
                above 75, danger above 90.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StorageUsage />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Waiting for results</CardTitle>
              <CardDescription>
                No known duration, so no value and no readout:
                the bar only signals that work is running.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                label="Searching…"
                variant="neutral"
              />
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
