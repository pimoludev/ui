"use client";

import { ToggleGroup, ToggleGroupItem } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            {
              (["default", "outline", "ghost"] as const).map((variant) => (<div
                key={variant}
                className="flex flex-wrap items-center gap-3 min-w-0"
              >
                <span className="text-sm text-muted leading-relaxed">{variant}</span>
                <ToggleGroup
                  type="multiple"
                  aria-label={`${variant} formatting`}
                  variant={variant}
                  size="sm"
                  classNames={{
                    root: "custom-toggle-group-root",
                    item: "custom-toggle-group-item"
                  }}
                >
                  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
                  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
                  <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
                </ToggleGroup>
              </div>))
            }
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">lg</span>
              <ToggleGroup
                type="multiple"
                aria-label="Large formatting"
                variant="outline"
                size="lg"
                classNames={{
                  root: "custom-toggle-group-root",
                  item: "custom-toggle-group-item"
                }}
              >
                <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
                <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-toggle-group-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-toggle-group-item {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
