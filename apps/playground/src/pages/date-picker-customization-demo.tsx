"use client";

import { DatePicker } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--two pg-grid--start">
            <DatePicker
              label="No date yet"
              placeholder="Choose a deadline"
              fullWidth
              classNames={{
                root: "custom-date-picker-root",
                label: "custom-date-picker-label"
              }}
            />
            <DatePicker
              label="Disabled"
              defaultValue={new Date(2026, 9, 14)}
              disabled
              fullWidth
              classNames={{
                root: "custom-date-picker-root",
                label: "custom-date-picker-label"
              }}
            />
            <DatePicker
              label="Read-only"
              defaultValue={new Date(2026, 9, 14)}
              readOnly
              fullWidth
              classNames={{
                root: "custom-date-picker-root",
                label: "custom-date-picker-label"
              }}
            />
            <DatePicker
              label="Required"
              required
              fullWidth
              classNames={{
                root: "custom-date-picker-root",
                label: "custom-date-picker-label"
              }}
            />
            <DatePicker
              label="Without clear"
              defaultValue={new Date(2026, 9, 14)}
              clearable={false}
              fullWidth
              classNames={{
                root: "custom-date-picker-root",
                label: "custom-date-picker-label"
              }}
            />
            <DatePicker
              label="Bounded"
              defaultValue={new Date(2026, 9, 14)}
              min={new Date(2026, 9, 10)}
              max={new Date(2026, 9, 20)}
              fullWidth
              classNames={{
                root: "custom-date-picker-root",
                label: "custom-date-picker-label"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-date-picker-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-date-picker-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
