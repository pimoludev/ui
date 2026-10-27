"use client";

import { TagsInput } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            {
              (["sm", "md", "lg"] as const).map((size) => (<TagsInput
                key={size}
                size={size}
                label={`Size ${size}`}
                placeholder="Add a tag"
                defaultValue={["pimolu"]}
                classNames={{
                  root: "custom-tags-input-root",
                  label: "custom-tags-input-label"
                }}
              />))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-tags-input-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-tags-input-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
