"use client";

import { useState } from "react";
import { TreeSelect } from "@pimolu/react";

export function DemoExample() {
  const [queue, setQueue] = useState<string | undefined>("queue-1");
  const options = [{ value: "support", label: "Support", children: Array.from({ length: 36 }, (_, index) => ({
    value: `queue-${index + 1}`, label: `Support queue ${index + 1}`,
  })) }];
  return <div className="pg-stack">
    <TreeSelect label="Support queue" options={options} value={queue} onValueChange={setQueue} fullWidth />
    <p role="status">Selected queue: {queue ?? "none"}.</p>
  </div>;
}
