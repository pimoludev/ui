"use client";

import { Toggle } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">default</span>
              <Toggle variant="default" classNames={{ root: "custom-toggle-root" }}>Off</Toggle>
              <Toggle
                variant="default"
                defaultPressed
                classNames={{
                  root: "custom-toggle-root"
                }}
              >
                On
              </Toggle>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">outline</span>
              <Toggle variant="outline" classNames={{ root: "custom-toggle-root" }}>Off</Toggle>
              <Toggle
                variant="outline"
                defaultPressed
                classNames={{
                  root: "custom-toggle-root"
                }}
              >
                On
              </Toggle>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">ghost</span>
              <Toggle variant="ghost" classNames={{ root: "custom-toggle-root" }}>Off</Toggle>
              <Toggle
                variant="ghost"
                defaultPressed
                classNames={{
                  root: "custom-toggle-root"
                }}
              >
                On
              </Toggle>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-toggle-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
