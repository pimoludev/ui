import { CustomizationExample } from "./date-range-picker-customization-demo";
import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DateRangePicker,
  type PimoluDateRange,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DEMO DATA
========================================= */

const TODAY = new Date(2026, 9, 20);

const presets = [
  {
    label: "Last 7 days",
    range: {
      from: new Date(2026, 9, 14),
      to: new Date(2026, 9, 20),
    },
  },
  {
    label: "This month",
    range: {
      from: new Date(2026, 9, 1),
      to: new Date(2026, 9, 31),
    },
  },
  {
    label: "Next week",
    range: {
      from: new Date(2026, 9, 26),
      to: new Date(2026, 10, 1),
    },
  },
];

const stayPresets = [
  {
    label: "This weekend",
    range: {
      from: new Date(2026, 9, 23),
      to: new Date(2026, 9, 25),
    },
  },
  {
    label: "Next week",
    range: {
      from: new Date(2026, 9, 26),
      to: new Date(2026, 10, 1),
    },
  },
];

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function dayNumber(date: Date) {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function countDays(range: PimoluDateRange) {
  if (!range.from || !range.to) return 0;

  return (
    Math.round(
      (dayNumber(range.to) - dayNumber(range.from)) /
        86_400_000
    ) + 1
  );
}

function countWeekdays(range: PimoluDateRange) {
  if (!range.from || !range.to) return 0;

  let count = 0;
  const cursor = startOfDay(range.from);

  while (cursor <= range.to) {
    const weekday = cursor.getDay();

    if (weekday !== 0 && weekday !== 6) {
      count += 1;
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
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

function formatRange(
  range: PimoluDateRange,
  locale = "en-US"
) {
  if (!range.from && !range.to) return "No period selected.";

  if (range.from && !range.to) {
    return `From ${formatDate(range.from, locale)}.`;
  }

  return `${formatDate(range.from, locale)} – ${formatDate(
    range.to,
    locale
  )}`;
}

/* =========================================
   EXAMPLES
========================================= */

function ControlledRangeExample() {
  const [range, setRange] = useState<PimoluDateRange>({
    from: new Date(2026, 9, 12),
    to: new Date(2026, 9, 18),
  });

  const days = countDays(range);

  return (
    <div className="pg-stack">
      <DateRangePicker
        label="Reporting period"
        value={range}
        onChange={setRange}
        min={new Date(2026, 0, 1)}
        max={new Date(2026, 11, 31)}
        fullWidth
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">{formatRange(range)}</span>

        <Badge variant="primary" appearance="soft">
          {days} {days === 1 ? "day" : "days"}
        </Badge>
      </div>
    </div>
  );
}

function PresetsExample() {
  const [range, setRange] = useState<PimoluDateRange>({
    from: new Date(2026, 9, 14),
    to: new Date(2026, 9, 20),
  });

  return (
    <div className="pg-stack">
      <DateRangePicker
        label="Date range"
        value={range}
        onChange={setRange}
        presets={presets}
        numberOfMonths={2}
        fullWidth
      />

      <p className="pg-meta">{formatRange(range)}</p>
    </div>
  );
}

function LocaleExample() {
  const [range, setRange] = useState<PimoluDateRange>({
    from: new Date(2026, 9, 12),
    to: new Date(2026, 9, 18),
  });

  return (
    <div className="pg-stack">
      <DateRangePicker
        label="Période de réservation"
        value={range}
        onChange={setRange}
        locale="fr-FR"
        weekStartsOn={1}
        numberOfMonths={2}
        fullWidth
      />

      <p className="pg-meta">{formatRange(range, "fr-FR")}</p>
    </div>
  );
}

function BookingExample() {
  const [range, setRange] = useState<PimoluDateRange>({
    from: new Date(2026, 9, 21),
    to: new Date(2026, 9, 25),
  });

  const nights = countDays(range) - 1;
  const complete = Boolean(range.from && range.to);

  return (
    <div className="pg-stack">
      <DateRangePicker
        label="Stay dates"
        value={range}
        onChange={setRange}
        min={TODAY}
        max={new Date(2027, 9, 20)}
        numberOfMonths={1}
        presets={stayPresets}
        fullWidth
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">Accommodation</span>

        <Badge
          variant={complete && nights > 0 ? "success" : "neutral"}
          appearance="soft"
        >
          {complete && nights > 0
            ? `${nights} ${nights === 1 ? "night" : "nights"}`
            : "Choose a stay"}
        </Badge>
      </div>

      <p className="pg-meta">
        {complete
          ? `${formatDate(range.from, "en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })} → ${formatDate(range.to, "en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })} · check-in from 3 pm`
          : "Pick an arrival and a departure date."}
      </p>
    </div>
  );
}

function ReportingExample() {
  const [range, setRange] = useState<PimoluDateRange>({
    from: new Date(2026, 9, 1),
    to: new Date(2026, 9, 31),
  });

  return (
    <div className="pg-stack">
      <DateRangePicker
        label="Report period"
        value={range}
        onChange={setRange}
        presets={presets}
        numberOfMonths={2}
        fullWidth
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">Working days</span>

        <Badge variant="primary" appearance="soft">
          {countWeekdays(range)}
        </Badge>
      </div>

      <p className="pg-meta">
        Weekends are excluded from the working-day count.
      </p>
    </div>
  );
}

/* =========================================
   PAGE
========================================= */

export function DateRangePickerPage() {
  return (
    <>
      <PageHeader
        title="DateRangePicker"
        hint="A two-month range field built on the shared Calendar. Controlled or uncontrolled, with optional presets, a footer summary, min/max and disabled dates. The field shows the range with Intl.DateTimeFormat, closes when the range is complete, and returns focus to the trigger. Styles come from @pimolu/web-styles/date-range-picker.css."
      />

      <Section
        title="Basic"
        hint="The first click sets the start, the second completes the range and closes the panel. The footer keeps asking for the missing endpoint until then."
      >
        <ControlledRangeExample />
      </Section>

      <Section
        title="Presets"
        hint="Presets are ordinary data: a label and a range. Choosing a complete preset closes the panel."
      >
        <PresetsExample />
      </Section>

      <Section
        title="Single month"
        hint="numberOfMonths=1 keeps the panel narrow for mobile or dense forms. The range model is identical."
      >
        <DateRangePicker
          label="Compact range"
          defaultValue={{
            from: new Date(2026, 9, 12),
            to: new Date(2026, 9, 18),
          }}
          numberOfMonths={1}
          fullWidth
        />
      </Section>

      <Section
        title="Locale and week start"
        hint="The trigger, calendars and footer all follow locale; Monday-first weeks suit the French example."
      >
        <LocaleExample />
      </Section>

      <Section
        title="States"
        hint="Empty, required, disabled, read-only and bounded fields, plus a field without the clear action."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <DateRangePicker
            label="No period yet"
            placeholder="Choose a reporting period"
            numberOfMonths={1}
            fullWidth
          />

          <DateRangePicker
            label="Disabled"
            defaultValue={{
              from: new Date(2026, 9, 12),
              to: new Date(2026, 9, 18),
            }}
            numberOfMonths={1}
            disabled
            fullWidth
          />

          <DateRangePicker
            label="Read-only"
            defaultValue={{
              from: new Date(2026, 9, 12),
              to: new Date(2026, 9, 18),
            }}
            numberOfMonths={1}
            readOnly
            fullWidth
          />

          <DateRangePicker
            label="Required"
            required
            numberOfMonths={1}
            fullWidth
          />

          <DateRangePicker
            label="Without clear"
            defaultValue={{
              from: new Date(2026, 9, 12),
              to: new Date(2026, 9, 18),
            }}
            numberOfMonths={1}
            clearable={false}
            fullWidth
          />

          <DateRangePicker
            label="Bounded"
            defaultValue={{
              from: new Date(2026, 9, 12),
              to: new Date(2026, 9, 18),
            }}
            min={new Date(2026, 9, 10)}
            max={new Date(2026, 9, 25)}
            numberOfMonths={1}
            fullWidth
          />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="A booking flow and a reporting filter built from the same field."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Book a stay</CardTitle>
              <CardDescription>
                Future dates only, a compact calendar, preset
                shortcuts and a nights summary.
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
                Two months with presets and a working-day count
                that excludes weekends.
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
