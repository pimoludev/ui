import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DatePicker,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DEMO DATA
========================================= */

const TODAY = new Date(2026, 9, 20);

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function compareDays(a: Date, b: Date) {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

function nightsBetween(from: Date | null, to: Date | null) {
  if (!from || !to) return 0;

  return Math.round(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) /
      86_400_000
  );
}

function formatDate(
  date: Date | null,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
) {
  if (!date) return "—";

  return new Intl.DateTimeFormat(locale, options).format(
    date
  );
}

function closedOnSundays(date: Date) {
  return date.getDay() === 0;
}

/* =========================================
   EXAMPLES
========================================= */

function ControlledDateExample() {
  const [date, setDate] = useState<Date | null>(
    new Date(2026, 9, 14)
  );

  return (
    <div className="pg-stack">
      <DatePicker
        label="Appointment date"
        value={date}
        onChange={setDate}
        min={TODAY}
        max={new Date(2026, 11, 31)}
        disabledDates={closedOnSundays}
        fullWidth
      />

      <p className="pg-meta">
        {date
          ? `Booked for ${formatDate(date, "en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}.`
          : "No date selected."}
      </p>
    </div>
  );
}

function LocaleExample() {
  const [date, setDate] = useState<Date | null>(
    new Date(2026, 9, 14)
  );

  return (
    <div className="pg-stack">
      <DatePicker
        label="Date de publication"
        locale="fr-FR"
        weekStartsOn={1}
        value={date}
        onChange={setDate}
        fullWidth
      />

      <p className="pg-meta">
        {date
          ? `Publication le ${formatDate(date, "fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}.`
          : "Aucune date choisie."}
      </p>
    </div>
  );
}

function BookingExample() {
  const [checkIn, setCheckIn] = useState<Date | null>(
    new Date(2026, 9, 21)
  );

  const [checkOut, setCheckOut] = useState<Date | null>(
    new Date(2026, 9, 25)
  );

  const nights = nightsBetween(checkIn, checkOut);

  function handleCheckIn(next: Date | null) {
    setCheckIn(next);

    if (next && checkOut && compareDays(checkOut, next) <= 0) {
      setCheckOut(null);
    }
  }

  return (
    <div className="pg-stack">
      <DatePicker
        label="Check-in"
        value={checkIn}
        onChange={handleCheckIn}
        min={TODAY}
        max={new Date(2027, 9, 20)}
        disabledDates={closedOnSundays}
        fullWidth
      />

      <DatePicker
        label="Check-out"
        value={checkOut}
        onChange={setCheckOut}
        min={checkIn ?? TODAY}
        max={new Date(2027, 9, 20)}
        disabledDates={closedOnSundays}
        fullWidth
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">Stay</span>

        <Badge
          variant={nights > 0 ? "primary" : "neutral"}
          appearance="soft"
        >
          {nights > 0
            ? `${nights} ${nights === 1 ? "night" : "nights"}`
            : "Choose two dates"}
        </Badge>
      </div>
    </div>
  );
}

function PublishExample() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="pg-stack">
      <DatePicker
        label="Publish on"
        value={date}
        onChange={setDate}
        min={TODAY}
        max={new Date(2026, 11, 24)}
        required
        clearable
        fullWidth
      />

      <p className="pg-meta">
        {date
          ? `Scheduled for ${formatDate(date)}.`
          : "Pick a publication date before publishing."}
      </p>
    </div>
  );
}

/* =========================================
   PAGE
========================================= */

export function DatePickerPage() {
  return (
    <>
      <PageHeader
        title="DatePicker"
        hint="A button-shaped field that opens a single-month Calendar in an anchored portal. The value is controlled or uncontrolled, dates are formatted with Intl.DateTimeFormat, selection closes the panel and Escape returns focus to the trigger. Styles come from @pimolu/web-styles/date-picker.css."
      />

      <Section
        title="Basic"
        hint="A controlled value with min/max and Sundays disabled. The clear button appears as soon as a date is selected."
      >
        <ControlledDateExample />
      </Section>

      <Section
        title="Locale and week start"
        hint="The trigger and the calendar share the locale; weekStartsOn controls the first grid column."
      >
        <LocaleExample />
      </Section>

      <Section
        title="States"
        hint="Empty, required, disabled and read-only fields. Read-only keeps the value focusable without opening the calendar."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <DatePicker
            label="No date yet"
            placeholder="Choose a deadline"
            fullWidth
          />

          <DatePicker
            label="Disabled"
            defaultValue={new Date(2026, 9, 14)}
            disabled
            fullWidth
          />

          <DatePicker
            label="Read-only"
            defaultValue={new Date(2026, 9, 14)}
            readOnly
            fullWidth
          />

          <DatePicker
            label="Required"
            required
            fullWidth
          />

          <DatePicker
            label="Without clear"
            defaultValue={new Date(2026, 9, 14)}
            clearable={false}
            fullWidth
          />

          <DatePicker
            label="Bounded"
            defaultValue={new Date(2026, 9, 14)}
            min={new Date(2026, 9, 10)}
            max={new Date(2026, 9, 20)}
            fullWidth
          />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Two realistic compositions: a stay with linked bounds and a scheduled publication."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Book a stay</CardTitle>
              <CardDescription>
                Check-out cannot precede check-in, both fields
                close on Sundays, and the stay is summarized in
                nights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule a publication</CardTitle>
              <CardDescription>
                A required date limited to the next quarter,
                with the chosen day echoed below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PublishExample />
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
