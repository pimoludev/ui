"use client";
import { DonutChart } from "@pimolu/react";
export function DemoExample() {
  const data = [{ label: "Organic", value: 320 }, { label: "Direct", value: 180 }, { label: "Referral", value: 100 }];
  return <DonutChart aria-label="Distribution with a total, fictional data" data={data} centerValue="600" centerLabel="Visits" />;
}
