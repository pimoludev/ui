"use client";
import { AreaChart } from "@pimolu/react";
export function DemoExample() {
  const series = [{ name: "Storage", values: [12, 16, 14, 21, 28, 32] }];
  return <AreaChart aria-label="Smooth trend, fictional data" series={series} curve="smooth" showPoints valueFormatter={(value) => `${value} GB`} />;
}
