"use client";
import { Sparkline } from "@pimolu/react";
export function SparklineExample() {
  const data = [18, 23, 20, 31, 28, 36, 42];
  return <Sparkline aria-label="Fictional Sparkline dataset" data={data} width={240} height={64} />;
}
