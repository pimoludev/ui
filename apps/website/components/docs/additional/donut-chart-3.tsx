"use client";
import { DonutChart } from "@pimolu/react";
export function DemoExample() {
  const data = [{ label: "Design", value: 45, color: "#6366f1" }, { label: "Engineering", value: 35, color: "#0891b2" }, { label: "Product", value: 20, color: "#b45309" }];
  return <DonutChart aria-label="Custom palette, fictional data" data={data} thickness={38} />;
}
