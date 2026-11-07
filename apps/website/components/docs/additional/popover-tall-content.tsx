"use client";

import { Popover, Button, Checkbox } from "@pimolu/react";
export function DemoExample() {
  return (
    <Popover
      label="Release checklist"
      placement="right"
      content={
        <div className="flex flex-col gap-4">
          <p>Release checklist</p>
          {Array.from({ length: 16 }, (_, index) => (
            <Checkbox key={index} label={`Review item ${index + 1}`} />
          ))}
        </div>
      }
    >
      <Button appearance="outline">Review the checklist</Button>
    </Popover>
  );
}
