"use client";

import { Checkbox } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <Checkbox
              size="sm"
              label="sm"
              defaultChecked
              classNames={{
                root: "custom-checkbox-root",
                label: "custom-checkbox-label"
              }}
            />
            <Checkbox
              size="md"
              label="md"
              defaultChecked
              classNames={{
                root: "custom-checkbox-root",
                label: "custom-checkbox-label"
              }}
            />
            <Checkbox
              size="lg"
              label="lg"
              defaultChecked
              classNames={{
                root: "custom-checkbox-root",
                label: "custom-checkbox-label"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-checkbox-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-checkbox-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
