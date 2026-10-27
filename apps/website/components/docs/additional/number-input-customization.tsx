"use client";

import { NumberInput } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            {
              (["sm", "md", "lg"] as const).map((size) => (<NumberInput
                key={size}
                size={size}
                label={`Size ${size}`}
                defaultValue={12}
                min={0}
                classNames={{
                  root: "custom-number-input-root",
                  label: "custom-number-input-label"
                }}
              />))
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
    </div>
  );
}
