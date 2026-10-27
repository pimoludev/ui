"use client";

import { Badge } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <Badge
              size="sm"
              classNames={{
                root: "custom-badge-root",
                label: "custom-badge-label"
              }}
            >
              sm
            </Badge>
            <Badge
              size="md"
              classNames={{
                root: "custom-badge-root",
                label: "custom-badge-label"
              }}
            >
              md
            </Badge>
            <Badge
              size="lg"
              classNames={{
                root: "custom-badge-root",
                label: "custom-badge-label"
              }}
            >
              lg
            </Badge>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-badge-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-badge-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
