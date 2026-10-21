"use client";

import { useState } from "react";
import { Button, DonutChart } from "@pimolu/react";

export function ChartExample() {
  const [week, setWeek] = useState(false);
  const data = week ? [{ label: "Design", value: 14 }, { label: "Engineering", value: 20 }, { label: "Research", value: 6 }] : [{ label: "Design", value: 36 }, { label: "Engineering", value: 48 }, { label: "Research", value: 16 }];
  return <div className="space-y-5">
    <Button appearance="outline" onClick={() => setWeek(!week)}>Show {week ? "this month" : "this week"}</Button>
    <DonutChart aria-label={`Tasks completed ${week ? "this week" : "this month"}`} data={data} centerValue={week ? "40" : "100"} centerLabel="Tasks completed" width={240} height={240} />
  </div>;
}
