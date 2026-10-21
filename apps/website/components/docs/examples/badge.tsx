"use client";

import { useState } from "react";
import { Badge, badgeVariantMap, Select } from "@pimolu/react";

export function BadgeExample() {
  const [variant, setVariant] = useState<keyof typeof badgeVariantMap.variant>("success");
  return <div className="space-y-6">
    <Select label="Badge tone" value={variant} onValueChange={(value) => setVariant(value as keyof typeof badgeVariantMap.variant)}>{Object.keys(badgeVariantMap.variant).map((value) => <option key={value} value={value}>{value}</option>)}</Select>
    <div className="flex flex-wrap gap-3"><Badge variant={variant}>Deployment ready</Badge><Badge variant={variant} appearance="outline">Version 1.0</Badge></div>
  </div>;
}
