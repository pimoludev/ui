"use client";

import { useState } from "react";
import { Select } from "@pimolu/react";

export function DemoExample() {
  const [queue, setQueue] = useState("queue-1");
  return <div className="pg-stack">
    <Select label="Support queue" value={queue} onValueChange={setQueue} fullWidth
      helperText="Swipe through the list, then tap a queue to select it.">
      {Array.from({ length: 36 }, (_, index) => <option key={index} value={`queue-${index + 1}`}>
        {`Support queue ${index + 1}`}
      </option>)}
    </Select>
    <p role="status">Selected queue: {queue}.</p>
  </div>;
}
