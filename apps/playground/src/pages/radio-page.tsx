import { CustomizationExample } from "./radio-customization-demo";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Radio,
  RadioGroup,
} from "@pimolu/react";

import {
  radioOrientations,
  radioSizes,
  radioVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

const frameworks = [
  {
    value: "react",
    label: "React",
    description: "Library for building interfaces.",
  },
  {
    value: "nextjs",
    label: "Next.js",
    description: "Full-stack React framework.",
  },
  {
    value: "angular",
    label: "Angular",
    description: "Complete web framework.",
  },
];

function FrameworkExample() {
  const [framework, setFramework] = useState("react");

  return (
    <div className="pg-stack">
      <RadioGroup
        label="Framework"
        name="framework"
        value={framework}
        onValueChange={setFramework}
        description="Choose the stack for this project."
      >
        {frameworks.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
          />
        ))}
      </RadioGroup>

      <p className="pg-meta">
        Selected value: <strong>{framework}</strong>
      </p>
    </div>
  );
}

export function RadioPage() {
  return (
    <>
      <PageHeader
        title="Radio"
        hint="A single choice among options, built on native fieldset, legend and radio inputs so keyboard and forms work natively. Sizes, variants and orientations are enumerated from the variant maps; the styles come from @pimolu/web-styles/radio.css."
      />

      <Section title="Sizes" hint="sm, md and lg.">
        <div className="pg-stack">
          {radioSizes.map((size) => (
            <RadioGroup
              key={size}
              size={size}
              orientation="horizontal"
              defaultValue="a"
              label={size}
            >
              <Radio value="a" label="Selected" />
              <Radio value="b" label="Other" />
            </RadioGroup>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The color of the selected circle."
      >
        <div className="pg-stack">
          {radioVariants.map((variant) => (
            <RadioGroup
              key={variant}
              variant={variant}
              orientation="horizontal"
              defaultValue="a"
              label={variant}
            >
              <Radio value="a" label="Selected" />
              <Radio value="b" label="Other" />
            </RadioGroup>
          ))}
        </div>
      </Section>

      <Section
        title="Orientation"
        hint="Vertical by default, horizontal on demand."
      >
        <div className="pg-grid">
          {radioOrientations.map((orientation) => (
            <RadioGroup
              key={orientation}
              orientation={orientation}
              defaultValue="a"
              label={orientation}
            >
              <Radio value="a" label="Option A" />
              <Radio value="b" label="Option B" />
              <Radio value="c" label="Option C" />
            </RadioGroup>
          ))}
        </div>
      </Section>

      <Section
        title="States"
        hint="Disabled group, individual disabled option, required and described options."
      >
        <div className="pg-stack">
          <RadioGroup label="Disabled group" disabled>
            <Radio value="a" label="Option A" />
            <Radio value="b" label="Option B" />
          </RadioGroup>

          <RadioGroup label="Individual option disabled">
            <Radio value="a" label="Option A" />
            <Radio
              value="b"
              label="Option B"
              description="Not available on your plan."
              disabled
            />
          </RadioGroup>

          <RadioGroup
            label="Required"
            name="required-example"
            required
          >
            <Radio value="a" label="Option A" />
            <Radio value="b" label="Option B" />
          </RadioGroup>

          <RadioGroup
            label="Invalid option"
            defaultValue="a"
          >
            <Radio value="a" label="Option A" />
            <Radio
              value="b"
              label="Option B"
              aria-invalid="true"
              description="This option conflicts with your settings."
            />
          </RadioGroup>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Choosing a stack</CardTitle>
              <CardDescription>
                A controlled group with descriptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FrameworkExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan</CardTitle>
              <CardDescription>
                An uncontrolled group with a default selection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                label="Plan"
                name="plan"
                defaultValue="pro"
              >
                <Radio
                  value="free"
                  label="Free"
                  description="For personal projects."
                />
                <Radio
                  value="pro"
                  label="Pro"
                  description="For professional teams."
                />
                <Radio
                  value="enterprise"
                  label="Enterprise"
                  description="Custom contracts."
                />
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification frequency</CardTitle>
              <CardDescription>
                A horizontal group for compact choices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                label="Frequency"
                name="frequency"
                orientation="horizontal"
                defaultValue="daily"
              >
                <Radio value="daily" label="Daily" />
                <Radio value="weekly" label="Weekly" />
                <Radio value="never" label="Never" />
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
