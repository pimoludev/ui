"use client";

import { Switch } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <Switch
              size="sm"
              label="sm"
              defaultChecked
              classNames={{
                root: "custom-switch-root",
                label: "custom-switch-label"
              }}
            />
            <Switch
              size="md"
              label="md"
              defaultChecked
              classNames={{
                root: "custom-switch-root",
                label: "custom-switch-label"
              }}
            />
            <Switch
              size="lg"
              label="lg"
              defaultChecked
              classNames={{
                root: "custom-switch-root",
                label: "custom-switch-label"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-switch-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-switch-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
