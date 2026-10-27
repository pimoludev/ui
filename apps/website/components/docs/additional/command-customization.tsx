"use client";

import { Command, type PimoluCommandItem, Badge } from "@pimolu/react";
import { useState } from "react";

const items: PimoluCommandItem[] = [
  {
    id: "new-project",
    label: "New project",
    group: "Create",
    keywords: ["start", "init"],
    shortcut: "N",
  },
  {
    id: "new-component",
    label: "New component",
    group: "Create",
    keywords: ["react", "registry"],
  },
  {
    id: "open-settings",
    label: "Open settings",
    group: "Navigate",
    keywords: ["preferences", "theme"],
    shortcut: "⌘,",
  },
  {
    id: "open-docs",
    label: "Open documentation",
    group: "Navigate",
    keywords: ["help", "guide"],
  },
  {
    id: "copy-link",
    label: "Copy project link",
    group: "Actions",
    keywords: ["share", "url"],
  },
  {
    id: "archive",
    label: "Archive project",
    group: "Actions",
    keywords: ["hide", "close"],
    disabled: true,
  },
];

export function DemoExample() {
  const [selected, setSelected] = useState("none");
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <Command
              items={items}
              aria-label="Project commands"
              onSelect={(item) => setSelected(item.label)}
              classNames={{
                root: "custom-command-root",
                label: "custom-command-label"
              }}
            />
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <Badge variant="neutral">selected: {selected}</Badge>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-command-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-command-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
