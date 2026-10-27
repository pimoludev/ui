"use client";

import { Select } from "@pimolu/react";

export function DemoExample() {
  return (
    <>
      <Select
        label="Workspace"
        defaultValue="studio"
        classNames={{
          control: "parts-select-control",
          listbox: "parts-select-panel",
          option: "parts-select-option"
        }}
      >
        <option value="studio">Design studio</option>
        <option value="engineering">Engineering</option>
        <option value="archive" disabled>Archived workspace</option>
      </Select>
      <style>
        {
          `
.parts-select-control {
  border-radius: 12px;
}
.parts-select-panel {
  border-radius: 16px;
  --pimolu-primary: var(--pimolu-success);
  --pimolu-primary-foreground: var(--pimolu-success-foreground);
}
.parts-select-option {
  padding-block: 12px;
}
`
        }
      </style>
    </>
  );
}
