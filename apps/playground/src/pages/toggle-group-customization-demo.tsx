"use client";

import { ToggleGroup, ToggleGroupItem } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              (["default", "outline", "ghost"] as const).map(
                (variant) => (
                  <div key={variant} className="pg-row">
                    <span className="pg-meta">{variant}</span>
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
                      <ToggleGroupItem value="bold">
                        Bold
                      </ToggleGroupItem>
                      <ToggleGroupItem value="italic">
                        Italic
                      </ToggleGroupItem>
                      <ToggleGroupItem value="underline">
                        Underline
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                )
              )
            }
            <div className="pg-row">
              <span className="pg-meta">lg</span>
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
                <ToggleGroupItem value="bold">
                  Bold
                </ToggleGroupItem>
                <ToggleGroupItem value="italic">
                  Italic
                </ToggleGroupItem>
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
    </>
  );
}
