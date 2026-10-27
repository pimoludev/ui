"use client";

import { PinInput } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            <PinInput
              label="Uncontrolled code"
              classNames={{
                root: "custom-pin-input-root",
                label: "custom-pin-input-label"
              }}
            />
            <PinInput
              label="Four digits"
              length={4}
              helperText="Try pasting 12 34 to fill both remaining cells."
              classNames={{
                root: "custom-pin-input-root",
                label: "custom-pin-input-label"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-pin-input-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-pin-input-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
