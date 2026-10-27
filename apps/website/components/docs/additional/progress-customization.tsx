"use client";

import { Progress } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            <div className="grid gap-3 min-w-0">
              <Progress
                label="Size sm"
                size="sm"
                value={60}
                classNames={{
                  root: "custom-progress-root",
                  label: "custom-progress-label"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">sm</span>
            </div>
            <div className="grid gap-3 min-w-0">
              <Progress
                label="Size md"
                size="md"
                value={60}
                classNames={{
                  root: "custom-progress-root",
                  label: "custom-progress-label"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">md</span>
            </div>
            <div className="grid gap-3 min-w-0">
              <Progress
                label="Size lg"
                size="lg"
                value={60}
                classNames={{
                  root: "custom-progress-root",
                  label: "custom-progress-label"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">lg</span>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-progress-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-progress-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
