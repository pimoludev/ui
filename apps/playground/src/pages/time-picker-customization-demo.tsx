"use client";

import { TimePicker } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--start">
            {
              (["sm", "md", "lg"] as const).map(
                (size) => (
                  <TimePicker
                    key={size}
                    size={size}
                    label={`Size ${size}`}
                    defaultValue="09:30"
                    classNames={{
                      root: "custom-time-picker-root",
                      label: "custom-time-picker-label"
                    }}
                  />
                )
              )
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-time-picker-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-time-picker-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
