"use client";

import { Spinner } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <div className="grid gap-3 min-w-0">
              <Spinner
                appearance="circular"
                size="lg"
                classNames={{
                  root: "custom-spinner-root",
                  label: "custom-spinner-label"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">circular</span>
            </div>
            <div className="grid gap-3 min-w-0">
              <Spinner
                appearance="dots"
                size="lg"
                classNames={{
                  root: "custom-spinner-root",
                  label: "custom-spinner-label"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">dots</span>
            </div>
            <div className="grid gap-3 min-w-0">
              <Spinner
                appearance="arc"
                size="lg"
                classNames={{
                  root: "custom-spinner-root",
                  label: "custom-spinner-label"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">arc</span>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-spinner-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-spinner-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
