"use client";

import { Label, Input } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="grid gap-5 min-w-0">
              <Label
                htmlFor="label-required-custom-parts"
                required
                classNames={{
                  root: "custom-label-root"
                }}
              >
                Email
              </Label>
              <Input
                id="label-required-custom-parts"
                type="email"
                placeholder="ada@example.com"
              />
            </div>
            <div className="grid gap-5 min-w-0">
              <Label
                htmlFor="label-optional-custom-parts"
                optional
                optionalLabel="Optional"
                classNames={{
                  root: "custom-label-root"
                }}
              >
                Phone
              </Label>
              <Input
                id="label-optional-custom-parts"
                type="tel"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            <div className="grid gap-5 min-w-0">
              <Label
                htmlFor="label-disabled-custom-parts"
                disabled
                classNames={{
                  root: "custom-label-root"
                }}
              >
                Workspace
              </Label>
              <Input id="label-disabled-custom-parts" defaultValue="pimolu" disabled />
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-label-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
