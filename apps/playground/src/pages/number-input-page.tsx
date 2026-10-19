import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  NumberInput,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function PriceField() {
  const [price, setPrice] = useState<number | null>(
    49.99
  );

  return (
    <NumberInput
      label="Unit price"
      value={price}
      onValueChange={setPrice}
      min={0}
      step={0.01}
      precision={2}
      prefix="$"
      suffix="USD"
      helperText={
        price === null
          ? "Enter a price to continue."
          : `Selected price: $${price.toFixed(2)}`
      }
    />
  );
}

function SeatPicker() {
  const [seats, setSeats] = useState<number | null>(5);

  const total = (seats ?? 0) * 12;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team seats</CardTitle>

        <CardDescription>
          $12 per seat, billed monthly. Add up to
          eight seats from this plan.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="pg-stack">
          <NumberInput
            label="Number of seats"
            value={seats}
            onValueChange={setSeats}
            min={1}
            max={8}
            step={1}
            helperText="Use the steppers or the arrow keys."
          />

          <div className="pg-row">
            <Badge variant={seats ? "primary" : "neutral"}>
              {seats ?? 0} seats
            </Badge>

            <span className="pg-meta">
              ${total.toFixed(2)} / month
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NumberInputPage() {
  return (
    <>
      <PageHeader
        title="Number Input"
        hint="A text field with decimal input mode, bounded steppers, precision, keyboard stepping and clamping on blur. Styles come from @pimolu/web-styles/number-input.css."
      />

      <Section
        title="Sizes"
        hint="sm, md and lg share the Input height scale."
      >
        <div className="pg-grid pg-grid--start">
          {(["sm", "md", "lg"] as const).map(
            (size) => (
              <NumberInput
                key={size}
                size={size}
                label={`Size ${size}`}
                defaultValue={12}
                min={0}
              />
            )
          )}
        </div>
      </Section>

      <Section
        title="Prefix, suffix and precision"
        hint="The visible text is a formatted string, so affixes and decimals stay readable. Typing a comma as the decimal separator also works."
      >
        <div className="pg-grid pg-grid--start">
          <PriceField />

          <NumberInput
            label="Duration"
            defaultValue={90}
            min={15}
            max={480}
            step={15}
            suffix="min"
            helperText="Steps of 15 minutes, up to 8 hours."
          />

          <NumberInput
            label="Weight"
            defaultValue={72.5}
            min={0}
            step={0.5}
            precision={1}
            suffix="kg"
          />
        </div>
      </Section>

      <Section
        title="Bounds and keyboard"
        hint="Arrow keys step by `step`; Page Up and Page Down step ten times; Home and End jump to min and max when provided. Blur clamps out-of-range values."
      >
        <div className="pg-grid pg-grid--start">
          <NumberInput
            label="Guests"
            defaultValue={4}
            min={2}
            max={12}
            step={2}
            helperText="Even numbers only, from 2 to 12."
          />

          <NumberInput
            label="No steppers"
            defaultValue={30}
            showSteppers={false}
            suffix="%"
            helperText="Keyboard stepping still works."
          />
        </div>
      </Section>

      <Section
        title="States"
        hint="Invalid, disabled and read-only fields keep the same layout."
      >
        <div className="pg-grid pg-grid--start">
          <NumberInput
            label="Invalid"
            defaultValue={0}
            min={1}
            errorMessage="The quantity must be at least 1."
          />

          <NumberInput
            label="Disabled"
            defaultValue={8}
            disabled
          />

          <NumberInput
            label="Read only"
            defaultValue={42}
            readOnly
            suffix="units"
          />
        </div>
      </Section>

      <Section
        title="Example"
        hint="A checkout line item combines a bounded quantity with a calculated total."
      >
        <SeatPicker />
      </Section>
    </>
  );
}
