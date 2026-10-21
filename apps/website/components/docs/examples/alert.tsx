"use client";

import { useState } from "react";
import { Alert, Button, Select, alertVariantMap } from "@pimolu/react";

export function AlertExample() {
  const [variant, setVariant] = useState<keyof typeof alertVariantMap.variant>("success");
  const [visible, setVisible] = useState(true);
  return <div className="space-y-6">
    <Select label="Alert tone" value={variant} onValueChange={(value) => setVariant(value as keyof typeof alertVariantMap.variant)}>{Object.keys(alertVariantMap.variant).map((value) => <option key={value} value={value}>{value}</option>)}</Select>
    {visible ? <Alert variant={variant} title="Your workspace is ready." description="Everything has a place. Start with your first project." onDismiss={() => setVisible(false)} dismissLabel="Dismiss workspace message" /> : <Button appearance="outline" onClick={() => setVisible(true)}>Show the message again</Button>}
  </div>;
}
