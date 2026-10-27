"use client";

import { FormField, FormControl, Input } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <FormField
              label="Email"
              helperText="We only use it for account notices."
              required
              classNames={{
                root: "custom-form-field-root",
                label: "custom-form-field-label"
              }}
            >
              <FormControl>
                <Input type="email" placeholder="ada@example.com" />
              </FormControl>
            </FormField>
            <FormField
              label="Workspace"
              helperText="This value comes from the plan."
              disabled
              classNames={{
                root: "custom-form-field-root",
                label: "custom-form-field-label"
              }}
            >
              <FormControl>
                <Input defaultValue="pimolu" />
              </FormControl>
            </FormField>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-form-field-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-form-field-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
