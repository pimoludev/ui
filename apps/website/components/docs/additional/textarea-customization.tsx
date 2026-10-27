"use client";

import { Textarea } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <Textarea
              size="xs"
              label="xs"
              placeholder="Placeholder"
              rows={2}
              classNames={{
                root: "custom-textarea-root",
                label: "custom-textarea-label"
              }}
            />
            <Textarea
              size="sm"
              label="sm"
              placeholder="Placeholder"
              rows={2}
              classNames={{
                root: "custom-textarea-root",
                label: "custom-textarea-label"
              }}
            />
            <Textarea
              size="md"
              label="md"
              placeholder="Placeholder"
              rows={2}
              classNames={{
                root: "custom-textarea-root",
                label: "custom-textarea-label"
              }}
            />
            <Textarea
              size="lg"
              label="lg"
              placeholder="Placeholder"
              rows={2}
              classNames={{
                root: "custom-textarea-root",
                label: "custom-textarea-label"
              }}
            />
            <Textarea
              size="xl"
              label="xl"
              placeholder="Placeholder"
              rows={2}
              classNames={{
                root: "custom-textarea-root",
                label: "custom-textarea-label"
              }}
            />
            <Textarea
              size="xxl"
              label="xxl"
              placeholder="Placeholder"
              rows={2}
              classNames={{
                root: "custom-textarea-root",
                label: "custom-textarea-label"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-textarea-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-textarea-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
