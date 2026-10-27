"use client";

import { Combobox } from "@pimolu/react";

export function DemoExample() {
  return (
    <>
      <Combobox
        label="Invite a teammate"
        placeholder="Search people..."
        options={[
          { value: "ada", label: "Ada Lovelace" },
          {
            value: "maya",
            label: "Maya Chen"
          }
        ]}
        classNames={{
          field: "parts-combo-field",
          listbox: "parts-combo-panel",
          option: "parts-combo-option"
        }}
      />
      <style>
        {
          `
.parts-combo-field {
  border-radius: 14px;
}
.parts-combo-panel {
  border-radius: 16px;
}
.parts-combo-option {
  padding-block: 12px;
}
`
        }
      </style>
    </>
  );
}
