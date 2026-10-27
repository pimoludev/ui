"use client";

import { Separator } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="grid gap-5 min-w-0">
              <span className="text-sm text-muted leading-relaxed">horizontal</span>
              <Separator classNames={{ root: "custom-separator-root" }} />
            </div>
            <div className="flex items-center gap-4">
              <span>Profile</span>
              <Separator
                orientation="vertical"
                classNames={{
                  root: "custom-separator-root"
                }}
              />
              <span>Settings</span>
              <Separator
                orientation="vertical"
                classNames={{
                  root: "custom-separator-root"
                }}
              />
              <span>Logout</span>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-separator-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
