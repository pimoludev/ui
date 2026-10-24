"use client";
import { Sparkline } from "@pimolu/react";
export function DemoExample() {
  const data = [24, 24, 24, 24, 24, 24];
  return <Sparkline aria-label="Stable values, fictional data" data={data} width={240} height={64} />;
}
