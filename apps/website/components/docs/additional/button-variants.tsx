"use client";

import { Button } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="flex flex-wrap items-center gap-3 min-w-0">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}
