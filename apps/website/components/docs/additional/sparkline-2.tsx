"use client";
import { Sparkline } from "@pimolu/react";
export function DemoExample() {
  const data = [12, 18, 15, 24, 22, 31, 36];
  return <Sparkline aria-label="Filled trend, fictional data" data={data} area width={240} height={64} />;
}
