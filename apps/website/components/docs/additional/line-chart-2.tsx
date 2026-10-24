"use client";
import { LineChart } from "@pimolu/react";
export function DemoExample() {
  const labels = ["Jul", "Aug", "Sep", "Oct"]; const series = [{ name: "Current", values: [22, 29, 26, 34] }, { name: "Previous", values: [18, 21, 24, 25] }];
  return <LineChart aria-label="Two reporting periods, fictional data" labels={labels} series={series} curve="smooth" />;
}
