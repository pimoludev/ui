"use client";

import { LineChart } from "@pimolu/react";

export function DemoExample() {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const series = [{ name: "This week", values: [18, 24, 21, 32, 28] }];
  return (
    <>
      {
        (
          <LineChart
            aria-label="Fictional LineChart dataset"
            labels={labels}
            series={series}
            yAxisLabel="Requests per second"
            showPoints
            classNames={{
              root: "custom-line-chart-root",
              line: "custom-line-chart-plot"
            }}
          />
        )
      }
      <style>
        {
          `
.custom-line-chart-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-line-chart-plot {
  opacity: .85;
}
`
        }
      </style>
    </>
  );
}
