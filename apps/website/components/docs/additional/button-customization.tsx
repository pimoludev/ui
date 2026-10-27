"use client";

import { Button } from "@pimolu/react";

export function DemoExample() {
  return (
    <>
      <Button
        classNames={{
          root: "parts-button",
          label: "parts-button-label",
          startIcon: "parts-button-icon"
        }}
        startIcon={<span aria-hidden="true">+</span>}
      >
        Create project
      </Button>
      <style>
        {
          `
.parts-button {
  border-radius: 16px;
  gap: 16px;
}
.parts-button:hover:enabled {
  background: var(--pimolu-success);
  color: var(--pimolu-success-foreground);
}
.parts-button-label {
  font-weight: 600;
}
.parts-button-icon {
  display: inline-flex;
  align-items: center;
}
`
        }
      </style>
    </>
  );
}
