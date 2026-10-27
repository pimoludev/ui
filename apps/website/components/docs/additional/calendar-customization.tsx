"use client";

import { useState } from "react";
import { Calendar } from "@pimolu/react";

const DEMO_MONTH = new Date(2026, 9, 1);

function formatDate(date: Date | null, locale = "en-US", options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
}) {
  if(!date)
    return "—";
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function SingleCalendarExample() {
  const [selected, setSelected] = useState<Date | null>(new Date(2026, 9, 14));
  return (
    <div className="grid gap-5 min-w-0">
      <Calendar
        aria-label="Appointment date"
        defaultMonth={DEMO_MONTH}
        selected={selected}
        onSelect={setSelected}
        classNames={{
          root: "custom-calendar-root",
          title: "custom-calendar-title"
        }}
      />
      <p className="text-sm text-muted leading-relaxed">
        {
          selected
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
            : "No date selected."
        }
      </p>
    </div>
  );
}

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <SingleCalendarExample />
        </>)
      }
      <style>
        {
          `
.custom-calendar-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-calendar-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
