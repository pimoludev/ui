"use client";

import { NumberInput } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--start">
            {
              (["sm", "md", "lg"] as const).map(
                (size) => (
                  <NumberInput
                    key={size}
                    size={size}
                    label={`Size ${size}`}
                    defaultValue={12}
                    min={0}
                    classNames={{
                      root: "custom-number-input-root",
                      label: "custom-number-input-label"
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
.custom-number-input-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-number-input-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
