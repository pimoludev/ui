"use client";
import { BarChart } from "@pimolu/react";
export function DemoExample() {
  const labels = ["Sep", "Oct", "Nov"]; const series = [{ name: "Design", values: [18, 24, 29] }, { name: "Engineering", values: [22, 31, 27] }];
  return <BarChart aria-label="Grouped comparisons, fictional data" labels={labels} series={series} />;
}
