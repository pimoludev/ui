"use client";

import { TreeView, type PimoluTreeItem } from "@pimolu/react";

const files: PimoluTreeItem[] = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [
          { id: "button", label: "button.tsx" },
          { id: "card", label: "card.tsx" },
          { id: "tabs", label: "tabs.tsx" },
        ],
      },
      { id: "app", label: "App.tsx" },
      { id: "styles", label: "styles.css" },
    ],
  },
  {
    id: "tests",
    label: "tests",
    children: [
      { id: "button-test", label: "button.test.tsx" },
      { id: "card-test", label: "card.test.tsx" },
    ],
  },
  { id: "readme", label: "README.md" },
  { id: "package", label: "package.json" },
];

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <TreeView
            items={files}
            aria-label="Project files"
            defaultExpandedIds={[
              "src",
              "components"
            ]}
            defaultSelectedId="tabs"
            classNames={{
              root: "custom-tree-view-root",
              label: "custom-tree-view-label"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-tree-view-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-tree-view-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
