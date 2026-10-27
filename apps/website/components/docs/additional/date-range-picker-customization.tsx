"use client";

import { DateRangePicker } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <DateRangePicker
            label="Compact range"
            defaultValue={{
              from: new Date(2026, 9, 12),
              to: new Date(2026, 9, 18),
            }}
            numberOfMonths={1}
            fullWidth
            classNames={{
              root: "custom-date-range-picker-root",
              label: "custom-date-range-picker-label"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-date-range-picker-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-date-range-picker-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
