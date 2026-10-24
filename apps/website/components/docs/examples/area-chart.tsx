"use client";

import { useState } from "react";
import { AreaChart, SegmentedControl } from "@pimolu/react";

export function AreaChartExample() {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenue = [34220, 37850, 35580, 41960, 42860, 48200];
  const previous = [22300, 21800, 23600, 25900, 27800, 30200];
  const [period, setPeriod] = useState("half");
  const count = period === "quarter" ? 3 : 6;

  return (
    <div className="space-y-6">
      <SegmentedControl
        aria-label="Revenue reporting period"
        value={period}
        onValueChange={setPeriod}
        options={[
          { value: "quarter", label: "Last quarter" },
          { value: "half", label: "Last 6 months" },
        ]}
      />
      <AreaChart
        aria-label="Monthly recognized revenue in USD, fictional reporting data"
        labels={months.slice(-count)}
        series={[
          { name: "2025", values: revenue.slice(-count) },
          { name: "2024", values: previous.slice(-count) },
        ]}
        curve="smooth"
        areaFill="gradient"
        valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
      />
    </div>
  );
}
