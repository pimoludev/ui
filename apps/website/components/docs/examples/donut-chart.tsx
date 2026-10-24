"use client";
import { DonutChart } from "@pimolu/react";
export function DonutChartExample() {
  const data = [{ label: "Completed", value: 62 }, { label: "In review", value: 24 }, { label: "Planned", value: 14 }];
  return <DonutChart aria-label="Fictional DonutChart dataset" data={data} centerValue="100" centerLabel="Total tasks" />;
}
