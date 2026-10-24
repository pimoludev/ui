"use client";
import { Sparkline } from "@pimolu/react";
export function DemoExample() {
  const data = [180, 152, 164, 131, 110, 118, 92];
  return <Sparkline aria-label="A falling metric, fictional data" data={data} color="var(--pimolu-success)" width={240} height={64} valueFormatter={(value) => `${value} ms`} />;
}
