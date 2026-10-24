"use client";
import { LineChart } from "@pimolu/react";
export function DemoExample() {
  const series = [{ name: "Latency", values: [120, 95, 110, 80, 92] }];
  return <LineChart aria-label="Visible observations, fictional data" series={series} showPoints valueFormatter={(value) => `${value} ms`} />;
}
