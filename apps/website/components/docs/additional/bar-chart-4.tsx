"use client";
import { BarChart } from "@pimolu/react";
export function DemoExample() {
  const data = [{ label: "Documentation", value: 82 }, { label: "Design system", value: 64 }, { label: "Website", value: 91 }];
  return <BarChart aria-label="Horizontal categories, fictional data" data={data} horizontal showValues valueFormatter={(value) => `${value}%`} />;
}
