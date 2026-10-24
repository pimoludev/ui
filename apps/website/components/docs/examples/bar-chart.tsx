"use client";
import { BarChart } from "@pimolu/react";
export function BarChartExample() {
  const data = [{ label: "Design", value: 24 }, { label: "Engineering", value: 38 }, { label: "Product", value: 19 }];
  return <BarChart aria-label="Fictional BarChart dataset" data={data} yAxisLabel="Completed tasks" />;
}
