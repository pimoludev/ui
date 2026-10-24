"use client";
import { AreaChart } from "@pimolu/react";
export function DemoExample() {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"]; const series = [{ name: "Sessions", values: [42, 58, 51, 72, 86] }];
  return <AreaChart aria-label="Solid fill, fictional data" labels={labels} series={series} areaFill="solid" />;
}
