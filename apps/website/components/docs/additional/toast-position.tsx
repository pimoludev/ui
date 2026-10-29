"use client";

import { useState } from "react";
import { Button, Select, toast, Toaster, type PimoluToastPosition } from "@pimolu/react";

export function DemoExample() {
  const [position, setPosition] = useState<PimoluToastPosition>("bottom-right");
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="grid gap-4">
      <Select label="Notification position" value={position}
        onValueChange={(value) => setPosition(value as PimoluToastPosition)}>
        <option value="top-left">Top start</option>
        <option value="top-center">Top center</option>
        <option value="top-right">Top end</option>
        <option value="bottom-left">Bottom start</option>
        <option value="bottom-center">Bottom center</option>
        <option value="bottom-right">Bottom end</option>
      </Select>
      <Button onClick={() => {
        setDismissed(false);
        toast.info("Take your time", {
          id: "timer-example",
          description: "Hover or focus the close button to pause the timer.",
          duration: 5000,
          onDismiss: () => setDismissed(true),
        });
      }}>Show notification</Button>
      <p role="status">{dismissed ? "Notification dismissed." : "The timer pauses during interaction."}</p>
      <Toaster position={position} label="Position example" />
    </div>
  );
}
