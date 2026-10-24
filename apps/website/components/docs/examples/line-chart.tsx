"use client";
import { LineChart } from "@pimolu/react";
export function LineChartExample() {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const series = [{ name: "This week", values: [18, 24, 21, 32, 28] }];
  return <LineChart aria-label="Fictional LineChart dataset" labels={labels} series={series} yAxisLabel="Requests per second" showPoints />;
}
