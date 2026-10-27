"use client";

import { TreeSelect, type PimoluTreeSelectOption } from "@pimolu/react";

const queues: PimoluTreeSelectOption[] = [
  {
    value: "billing",
    label: "Billing",
    children: [
      {
        value: "billing-invoices",
        label: "Invoices",
      },
      {
        value: "billing-refunds",
        label: "Refunds",
      },
      {
        value: "billing-plans",
        label: "Plans and upgrades",
      },
    ],
  },
  {
    value: "product",
    label: "Product",
    children: [
      {
        value: "product-desktop",
        label: "Desktop app",
      },
      {
        value: "product-mobile",
        label: "Mobile app",
        children: [
          {
            value: "product-mobile-ios",
            label: "iOS",
          },
          {
            value: "product-mobile-android",
            label: "Android",
          },
        ],
      },
      {
        value: "product-api",
        label: "API and integrations",
      },
    ],
  },
  {
    value: "trust",
    label: "Trust and safety",
    children: [
      {
        value: "trust-abuse",
        label: "Abuse reports",
      },
      {
        value: "trust-privacy",
        label: "Privacy requests",
      },
    ],
  },
  {
    value: "general",
    label: "General",
  },
];

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <TreeSelect
            label="Support queue"
            options={queues}
            defaultValue="product-mobile-android"
            placeholder="Select a queue"
            fullWidth
            classNames={{
              root: "custom-tree-select-root",
              label: "custom-tree-select-label"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-tree-select-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-tree-select-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
