"use client";

import { useState } from "react";
import { Alert, Button } from "@pimolu/react";

export function AlertExample() {
  const [visible, setVisible] = useState(true);
  return <div className="space-y-6">
    {visible ? <Alert variant="success" title="Your workspace is ready." description="Everything has a place. Start with your first project." onDismiss={() => setVisible(false)} dismissLabel="Dismiss workspace message" /> : <Button appearance="outline" onClick={() => setVisible(true)}>Show the message again</Button>}
  </div>;
}
