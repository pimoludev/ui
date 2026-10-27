"use client";

import { Transfer, type PimoluTransferItem } from "@pimolu/react";

const employees: PimoluTransferItem[] = [
  {
    key: "alice",
    label: "Alice Martin",
    description: "Product designer",
  },
  {
    key: "bob",
    label: "Bob Chen",
    description: "Front-end engineer",
  },
  {
    key: "carol",
    label: "Carol Diallo",
    description: "Engineering manager",
  },
  {
    key: "dana",
    label: "Dana Novak",
    description: "Data analyst",
  },
  {
    key: "eli",
    label: "Eli Moreau",
    description: "Platform engineer",
    disabled: true,
  },
  {
    key: "fatou",
    label: "Fatou Ndiaye",
    description: "Support lead",
  },
];

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Transfer
            data={employees}
            defaultTargetKeys={["fatou"]}
            titles={[
              "Available",
              "Selected"
            ]}
            searchable
            showCount
            listHeight={220}
            emptyMessage="Everyone is already selected."
            classNames={{
              root: "custom-transfer-root",
              title: "custom-transfer-title"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-transfer-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-transfer-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
