import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TimePicker,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function BookingTime() {
  const [time, setTime] = useState<string | null>(
    "10:00"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a delivery slot</CardTitle>

        <CardDescription>
          Slots run every 15 minutes between 09:00 and
          17:30. The field uses the native time input, so
          its 12- or 24-hour rendering follows the browser
          locale.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="pg-stack">
          <TimePicker
            label="Arrival time"
            value={time}
            onValueChange={setTime}
            min="09:00"
            max="17:30"
            step={900}
            fullWidth
            showFormatHint
            helperText="The clear button resets the slot."
          />

          <div className="pg-row">
            <Badge variant={time ? "primary" : "neutral"}>
              {time ?? "No slot selected"}
            </Badge>

            <Button size="sm" disabled={!time}>
              Reserve slot
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TimePickerPage() {
  return (
    <>
      <PageHeader
        title="Time Picker"
        hint="A styled native input[type=time] with min/max/step, optional seconds, a clear action and helper/error wiring. The platform renders an accessible picker and handles the 12- or 24-hour display. Styles come from @pimolu/web-styles/time-picker.css."
      />

      <Section
        title="Sizes"
        hint="sm, md and lg share the Input height scale."
      >
        <div className="pg-grid pg-grid--start">
          {(["sm", "md", "lg"] as const).map(
            (size) => (
              <TimePicker
                key={size}
                size={size}
                label={`Size ${size}`}
                defaultValue="09:30"
              />
            )
          )}
        </div>
      </Section>

      <Section
        title="Constraints"
        hint="min, max and step are forwarded to the native control, which keeps invalid keyboard values out of the field. step is expressed in seconds."
      >
        <div className="pg-grid pg-grid--start">
          <TimePicker
            label="Business hours"
            defaultValue="09:00"
            min="08:00"
            max="18:00"
            step={900}
            helperText="15-minute increments, 08:00 to 18:00."
          />

          <TimePicker
            label="Current time"
            helperText="Uncontrolled and clearable."
          />

          <TimePicker
            label="Fixed step"
            defaultValue="12:00"
            step={3600}
            helperText="One-hour increments."
          />
        </div>
      </Section>

      <Section
        title="Seconds and format"
        hint="withSeconds keeps the seconds segment and defaults the step to one second. showFormatHint adds a note about the locale-driven 12/24-hour display."
      >
        <div className="pg-grid pg-grid--start">
          <TimePicker
            label="Precise start"
            withSeconds
            defaultValue="10:15:30"
            helperText="Seconds are preserved in the value."
          />

          <TimePicker
            label="Locale format"
            defaultValue="16:45"
            showFormatHint
          />

          <TimePicker
            label="Custom note"
            defaultValue="08:15"
            showFormatHint
            formatHint="Your team works in 24-hour time."
          />
        </div>
      </Section>

      <Section
        title="States"
        hint="Disabled and read-only fields keep their value; invalid adds the error tone and message."
      >
        <div className="pg-grid pg-grid--start">
          <TimePicker
            label="Invalid"
            defaultValue="07:00"
            errorMessage="Choose a time after 08:00."
          />

          <TimePicker
            label="Disabled"
            defaultValue="09:00"
            disabled
          />

          <TimePicker
            label="Read only"
            defaultValue="09:00"
            readOnly
          />

          <TimePicker
            label="Clear disabled"
            defaultValue="09:00"
            clearable={false}
            helperText="No clear action on this field."
          />
        </div>
      </Section>

      <Section
        title="Example"
        hint="A booking form pairs the time field with constraints, a locale note and a completion action."
      >
        <BookingTime />
      </Section>
    </>
  );
}
