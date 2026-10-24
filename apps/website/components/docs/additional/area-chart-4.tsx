"use client";
import { AreaChart } from "@pimolu/react";
export function DemoExample() {
  const labels = ["Q1", "Q2", "Q3", "Q4"]; const series = [{ name: "Growth", values: [14, 23, 19, 36] }];
  return <AreaChart aria-label="Static presentation, fictional data" labels={labels} series={series} showTooltip={false} showLegend={false} />;
}
