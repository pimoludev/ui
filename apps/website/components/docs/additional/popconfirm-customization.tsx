"use client";

import { Popconfirm, Button, Badge } from "@pimolu/react";
import { useState } from "react";

export function DemoExample() {
  const [outcome, setOutcome] = useState("No confirmation resolved yet");
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <Popconfirm
                title="Delete the Atlas project?"
                description="All 24 tasks, 8 files and the project history will be permanently removed."
                variant="destructive"
                confirmLabel="Delete project"
                onConfirm={() => setOutcome("Deleted the Atlas project")}
                onCancel={() => setOutcome("Kept the Atlas project")}
                classNames={{
                  root: "custom-popconfirm-root",
                  title: "custom-popconfirm-title"
                }}
              >
                <Button appearance="outline">Delete project</Button>
              </Popconfirm>
              <Badge variant="neutral">
                {outcome}
              </Badge>
            </div>
            <p className="max-w-prose leading-relaxed">
              Press Escape or click outside to cancel; both call onCancel as
              well. The panel closes after the action and focus is already
              back on the trigger.
            </p>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-popconfirm-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-popconfirm-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
