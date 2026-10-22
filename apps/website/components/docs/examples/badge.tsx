"use client";

import { Badge } from "@pimolu/react";

export function BadgeExample() {
  return <div className="space-y-6">
    <div className="flex flex-wrap gap-3"><Badge variant="success">Deployment ready</Badge><Badge variant="neutral" appearance="outline">Version 1.0</Badge></div>
  </div>;
}
