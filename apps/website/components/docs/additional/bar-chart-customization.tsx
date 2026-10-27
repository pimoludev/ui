"use client";

import { BarChart } from "@pimolu/react";

export function DemoExample() {
  const data = [
    { label: "Design", value: 24 },
    { label: "Engineering", value: 38 },
    {
      label: "Product",
      value: 19
    }
  ];
  return (
    <>
      {
        (
          <BarChart
            aria-label="Fictional BarChart dataset"
            data={data}
            yAxisLabel="Completed tasks"
            classNames={{
              root: "custom-bar-chart-root",
              bar: "custom-bar-chart-plot"
            }}
          />
        )
      }
      <style>
        {
          `
.custom-bar-chart-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-bar-chart-plot {
  opacity: .85;
}
`
        }
      </style>
    </>
  );
}
