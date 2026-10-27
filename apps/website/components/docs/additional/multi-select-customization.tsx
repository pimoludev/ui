"use client";

import { MultiSelect } from "@pimolu/react";

export function DemoExample() {
  return (
    <>
      <MultiSelect
        label="Project teams"
        options={[
          { value: "design", label: "Design" },
          {
            value: "engineering",
            label: "Engineering"
          },
          {
            value: "research",
            label: "Research"
          }
        ]}
        defaultValue={["design"]}
        classNames={{
          listbox: "parts-multi-panel",
          option: "parts-multi-option",
          tag: "parts-multi-tag"
        }}
      />
      <style>
        {
          `
.parts-multi-panel {
  border-radius: 16px;
}
.parts-multi-option {
  padding-block: 12px;
}
.parts-multi-tag {
  border-radius: 6px;
}
`
        }
      </style>
    </>
  );
}
