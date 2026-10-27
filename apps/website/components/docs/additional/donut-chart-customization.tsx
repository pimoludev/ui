"use client";

import { DonutChart } from "@pimolu/react";

export function DemoExample() {
  const data = [
    { label: "Completed", value: 62 },
    { label: "In review", value: 24 },
    {
      label: "Planned",
      value: 14
    }
  ];
  return (
    <>
      {
        (
          <DonutChart
            aria-label="Fictional DonutChart dataset"
            data={data}
            centerValue="100"
            centerLabel="Total tasks"
            classNames={{
              root: "custom-donut-chart-root",
              segment: "custom-donut-chart-plot"
            }}
          />
        )
      }
      <style>
        {
          `
.custom-donut-chart-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-donut-chart-plot {
  opacity: .85;
}
`
        }
      </style>
    </>
  );
}
