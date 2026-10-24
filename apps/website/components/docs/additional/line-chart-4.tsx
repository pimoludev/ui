"use client";
import { LineChart } from "@pimolu/react";
export function DemoExample() {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"]; const series = [{ name: "Net change", values: [-8, 12, -3, 21, 16] }];
  return <LineChart aria-label="Positive and negative values, fictional data" labels={labels} series={series} showPoints yAxisLabel="Net change" />;
}
