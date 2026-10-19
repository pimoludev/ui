import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Separator,
} from "@pimolu/react";

import { checkboxSizes, checkboxVariants } from "../demo-data";
import { PageHeader, Section } from "../section";

const rows = ["Design tokens", "Components", "Playground"];

function SelectAllExample() {
  const [selected, setSelected] = useState<string[]>([
    "Design tokens",
  ]);

  const allChecked = selected.length === rows.length;
  const someChecked = selected.length > 0 && !allChecked;

  function toggle(name: string, checked: boolean) {
    setSelected((current) =>
      checked
        ? [...current, name]
        : current.filter((item) => item !== name),
    );
  }

  return (
    <div className="pg-stack">
      <Checkbox
        label="Select all"
        checked={allChecked}
        indeterminate={someChecked}
        onCheckedChange={(checked) =>
          setSelected(checked ? [...rows] : [])
        }
      />

      <Separator />

      <div className="pg-stack">
        {rows.map((row) => (
          <Checkbox
            key={row}
            label={row}
            checked={selected.includes(row)}
            onCheckedChange={(checked) => toggle(row, checked)}
          />
        ))}
      </div>
    </div>
  );
}

export function CheckboxPage() {
  return (
    <>
      <PageHeader
        title="Checkbox"
        hint="A native checkbox with label, description and a mixed state. Sizes and variants are enumerated from checkboxVariantMap; the styles come from @pimolu/web-styles/checkbox.css."
      />

      <Section title="Sizes" hint="sm, md and lg.">
        <div className="pg-stack">
          {checkboxSizes.map((size) => (
            <Checkbox
              key={size}
              size={size}
              label={size}
              defaultChecked
            />
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The color of the checked box."
      >
        <div className="pg-stack">
          {checkboxVariants.map((variant) => (
            <Checkbox
              key={variant}
              variant={variant}
              label={variant}
              defaultChecked
            />
          ))}
        </div>
      </Section>

      <Section
        title="States"
        hint="Unchecked, checked, mixed, disabled, required and described."
      >
        <div className="pg-stack">
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Mixed" indeterminate />
          <Checkbox label="Disabled, checked" disabled defaultChecked />
          <Checkbox label="Disabled, unchecked" disabled />
          <Checkbox label="Required" required />
          <Checkbox
            label="With a description"
            description="Help improve Pimolu."
            defaultChecked
          />
          <Checkbox
            label="Invalid"
            aria-invalid="true"
            description="This field is required."
          />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Select all</CardTitle>
              <CardDescription>
                The parent becomes mixed while only some rows are
                selected.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SelectAllExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Uncontrolled checkboxes with sensible defaults.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <Checkbox
                  label="Product updates"
                  description="New components and releases."
                  defaultChecked
                />
                <Checkbox
                  label="Security alerts"
                  description="Sign-ins from new devices."
                  defaultChecked
                />
                <Checkbox
                  label="Research invitations"
                  description="Occasional interviews."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms</CardTitle>
              <CardDescription>
                A required checkbox in a form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <Checkbox
                  label="I accept the terms of service"
                  description="Required to create the account."
                  required
                />
                <Checkbox
                  label="Send me the newsletter"
                  description="Optional."
                  variant="success"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
