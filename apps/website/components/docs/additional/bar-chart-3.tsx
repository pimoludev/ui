"use client";
import { BarChart } from "@pimolu/react";
export function DemoExample() {
  const labels = ["Sep", "Oct", "Nov"]; const series = [{ name: "Desktop", values: [40, 54, 62] }, { name: "Mobile", values: [24, 36, 45] }];
  return <BarChart aria-label="Stacked totals, fictional data" labels={labels} series={series} stacked showValues />;
}
