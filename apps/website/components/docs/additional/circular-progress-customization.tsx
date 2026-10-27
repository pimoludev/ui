"use client";

import { CircularProgress } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <div className="grid gap-3 min-w-0">
              <CircularProgress
                size="sm"
                value={65}
                showValue
                label="Size sm"
                classNames={{
                  root: "custom-circular-progress-root",
                  value: "custom-circular-progress-value"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">sm</span>
            </div>
            <div className="grid gap-3 min-w-0">
              <CircularProgress
                size="md"
                value={65}
                showValue
                label="Size md"
                classNames={{
                  root: "custom-circular-progress-root",
                  value: "custom-circular-progress-value"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">md</span>
            </div>
            <div className="grid gap-3 min-w-0">
              <CircularProgress
                size="lg"
                value={65}
                showValue
                label="Size lg"
                classNames={{
                  root: "custom-circular-progress-root",
                  value: "custom-circular-progress-value"
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
.custom-circular-progress-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-circular-progress-value {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
