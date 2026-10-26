"use client";

import { useState } from "react";
import { Cascader } from "@pimolu/react";

export function DemoExample() {
  const [path, setPath] = useState<readonly string[]>([]);
  const options = Array.from({ length: 36 }, (_, index) => ({
    value: `region-${index + 1}`, label: `Region ${index + 1}`,
    children: [{ value: `city-${index + 1}`, label: `City ${index + 1}` }],
  }));
  return <div className="pg-stack">
    <Cascader label="Delivery region" options={options} value={path} onChange={setPath} fullWidth />
    <p role="status">Selected path: {path.join(" / ") || "none"}.</p>
  </div>;
}
