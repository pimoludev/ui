"use client";

import { SegmentedControl } from "@pimolu/react";

const views = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "timeline", label: "Timeline" },
];

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <SegmentedControl
            aria-label="View"
            options={views}
            classNames={{
              root: "custom-segmented-control-root",
              item: "custom-segmented-control-item"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-segmented-control-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-segmented-control-item {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
