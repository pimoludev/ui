"use client";

import { Input } from "@pimolu/react";

export function DemoExample() {
  return (
    <>
      <Input
        label="Project name"
        helperText="Shared with your team."
        placeholder="Pimolu workspace"
        clearable
        defaultValue="Design system"
        classNames={{
          wrapper: "parts-input-wrapper",
          control: "parts-input-control",
          message: "parts-input-message"
        }}
      />
      <style>
        {
          `
.parts-input-wrapper {
  border-radius: 16px;
}
.parts-input-control {
  font-weight: 600;
}
.parts-input-message {
  font-style: italic;
}
`
        }
      </style>
    </>
  );
}
