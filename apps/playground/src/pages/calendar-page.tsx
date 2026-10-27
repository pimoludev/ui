import { CustomizationExample } from "./calendar-customization-demo";
import { useState } from "react";

import {
  Badge,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type PimoluDateRange,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DEMO DATA
========================================= */

const DEMO_MONTH = new Date(2026, 9, 1);
const TODAY = new Date(2026, 9, 20);

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

function countWeekdays(range: PimoluDateRange) {
  if (!range.from || !range.to) return 0;

  let count = 0;
  const cursor = new Date(
    range.from.getFullYear(),
    range.from.getMonth(),
    range.from.getDate()
  );

  while (cursor <= range.to) {
    const weekday = cursor.getDay();

    if (weekday !== 0 && weekday !== 6) {
      count += 1;
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
}

/* =========================================
   EXAMPLES
========================================= */

function SingleCalendarExample() {
  const [selected, setSelected] = useState<Date | null>(
    new Date(2026, 9, 14)
  );

  return (
    <div className="pg-stack">
      <Calendar
        aria-label="Appointment date"
        defaultMonth={DEMO_MONTH}
        selected={selected}
        onSelect={setSelected}
      />

      <p className="pg-meta">
        {selected
          ? `Selected: ${formatDate(
              selected,
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}`
          : "No date selected."}
      </p>
    </div>
  );
}

function RangeCalendarExample({
  numberOfMonths = 1,
  locale = "en-US",
  weekStartsOn = 0,
}: {
  numberOfMonths?: 1 | 2;
  locale?: string;
  weekStartsOn?: 0 | 1;
}) {
  const [range, setRange] = useState<PimoluDateRange>({
    from: new Date(2026, 9, 12),
    to: new Date(2026, 9, 18),
  });

  return (
    <div className="pg-stack">
      <Calendar
        mode="range"
        aria-label="Reporting period"
        defaultMonth={DEMO_MONTH}
        range={range}
        onRangeChange={setRange}
        numberOfMonths={numberOfMonths}
        locale={locale}
        weekStartsOn={weekStartsOn}
      />

      <p className="pg-meta">
        {range.from
          ? `${formatDate(range.from, locale)} → ${
              range.to
                ? formatDate(range.to, locale)
                : "select an end date"
            }`
          : "Select a start date."}
      </p>
    </div>
  );
}

function BookingExample() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="pg-stack">
      <Calendar
        aria-label="Consultation date"
        defaultMonth={DEMO_MONTH}
        selected={date}
        onSelect={setDate}
        min={TODAY}
        max={new Date(2026, 11, 31)}
        disabledDates={closedOnSundays}
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">Consultation</span>

        <Badge
          variant={date ? "success" : "neutral"}
          appearance="soft"
        >
          {date
            ? formatDate(date, "en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            : "Not scheduled"}
        </Badge>
      </div>

      <p className="pg-meta">
        Sundays are closed and past dates are unavailable.
      </p>
    </div>
  );
}

function ReportingExample() {
  const [range, setRange] = useState<PimoluDateRange>({
    from: new Date(2026, 9, 1),
    to: new Date(2026, 9, 31),
  });

  const weekdays = countWeekdays(range);

  return (
    <div className="pg-stack">
      <Calendar
        mode="range"
        aria-label="Reporting period"
        defaultMonth={DEMO_MONTH}
        range={range}
        onRangeChange={setRange}
        numberOfMonths={2}
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">Business days</span>

        <Badge variant="primary" appearance="soft">
          {weekdays}
        </Badge>
      </div>

      <p className="pg-meta">
        {range.from && range.to
          ? `${formatDate(range.from)} – ${formatDate(
              range.to
            )}`
          : "Choose two dates to build a reporting period."}
      </p>
    </div>
  );
}

/* =========================================
   PAGE
========================================= */

export function CalendarPage() {
  return (
    <>
      <PageHeader
        title="Calendar"
        hint="The shared month grid behind DatePicker and DateRangePicker. It renders real dates with no date dependency, supports single and range selection, min/max and disabled dates, locale-aware labels and a full roving-tabindex keyboard model. Styles come from @pimolu/web-styles/calendar.css."
      />

      <Section
        title="Single date"
        hint="Arrow keys move by day, PageUp/PageDown by month, Home/End across the week. Enter or Space selects the focused day."
      >
        <SingleCalendarExample />
      </Section>

      <Section
        title="Range"
        hint="The first click sets the start, the second sets the end, and the next click starts a new range. A range can be completed in either direction."
      >
        <RangeCalendarExample />
      </Section>

      <Section
        title="Two months"
        hint="numberOfMonths renders consecutive grids and keeps them in sync while navigating."
      >
        <RangeCalendarExample numberOfMonths={2} />
      </Section>

      <Section
        title="Constraints"
        hint="min and max are inclusive; disabledDates accepts a list or a predicate. Blocked days stay announced and keyboard reachable but cannot be selected."
      >
        <BookingExample />
      </Section>

      <Section
        title="Locale and week start"
        hint="Month names, weekday headers and accessible date labels follow locale. weekStartsOn switches the first column."
      >
        <RangeCalendarExample
          locale="fr-FR"
          weekStartsOn={1}
          numberOfMonths={1}
        />
      </Section>

      <Section
        title="Examples"
        hint="The calendar is the base of the two pickers; these compositions show the kind of jobs it handles."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Book a consultation</CardTitle>
              <CardDescription>
                Future dates only, Sundays closed, with the
                choice echoed as a status badge.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reporting period</CardTitle>
              <CardDescription>
                Two months, a range highlight and a business-day
                count for the selected period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportingExample />
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
