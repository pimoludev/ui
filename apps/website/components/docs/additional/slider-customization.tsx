"use client";

import { Slider } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            <div className="grid gap-3 min-w-0">
              <Slider
                label="Size sm"
                size="sm"
                defaultValue={40}
                showValue
                classNames={{
                  root: "custom-slider-root",
                  label: "custom-slider-label"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">sm</span>
            </div>
            <div className="grid gap-3 min-w-0">
              <Slider
                label="Size md"
                size="md"
                defaultValue={40}
                showValue
                classNames={{
                  root: "custom-slider-root",
                  label: "custom-slider-label"
                }}
              />
              <span className="text-sm text-muted leading-relaxed">md</span>
            </div>
            <div className="grid gap-3 min-w-0">
              <Slider
                label="Size lg"
                size="lg"
                defaultValue={40}
                showValue
                classNames={{
                  root: "custom-slider-root",
                  label: "custom-slider-label"
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
.custom-slider-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-slider-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
