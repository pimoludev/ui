"use client";
import { DonutChart } from "@pimolu/react";
export function DemoExample() {
  const data = [{ label: "Used", value: 72 }, { label: "Available", value: 28 }];
  return <DonutChart aria-label="Compact summary, fictional data" data={data} width={180} height={180} thickness={18} centerValue="72%" centerLabel="Capacity" showLegend={false} />;
}
