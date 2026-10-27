"use client";

import { Sparkline } from "@pimolu/react";

export function DemoExample() {
  const data = [18, 23, 20, 31, 28, 36, 42];
  return (
    <>
      {
        (
          <Sparkline
            aria-label="Fictional Sparkline dataset"
            data={data}
            width={240}
            height={64}
            classNames={{
              root: "custom-sparkline-root",
              line: "custom-sparkline-plot"
            }}
          />
        )
      }
      <style>
        {
          `
.custom-sparkline-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-sparkline-plot {
  opacity: .85;
}
`
        }
      </style>
    </>
  );
}
