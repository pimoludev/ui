"use client";

import { Cascader, type PimoluCascaderOption } from "@pimolu/react";

const regions: PimoluCascaderOption[] = [
  {
    value: "europe",
    label: "Europe",
    children: [
      {
        value: "france",
        label: "France",
        children: [
          { value: "paris", label: "Paris" },
          { value: "lyon", label: "Lyon" },
          { value: "bordeaux", label: "Bordeaux" },
        ],
      },
      {
        value: "germany",
        label: "Germany",
        children: [
          { value: "berlin", label: "Berlin" },
          { value: "munich", label: "Munich" },
        ],
      },
      {
        value: "spain",
        label: "Spain",
        children: [
          { value: "madrid", label: "Madrid" },
          { value: "barcelona", label: "Barcelona" },
        ],
      },
    ],
  },
  {
    value: "north-america",
    label: "North America",
    children: [
      {
        value: "canada",
        label: "Canada",
        children: [
          { value: "montreal", label: "Montréal" },
          { value: "toronto", label: "Toronto" },
        ],
      },
      {
        value: "united-states",
        label: "United States",
        children: [
          { value: "new-york", label: "New York" },
          { value: "san-francisco", label: "San Francisco" },
        ],
      },
    ],
  },
  {
    value: "asia",
    label: "Asia",
    children: [
      {
        value: "japan",
        label: "Japan",
        children: [
          { value: "tokyo", label: "Tokyo" },
          { value: "osaka", label: "Osaka" },
        ],
      },
      {
        value: "singapore",
        label: "Singapore",
        children: [
          { value: "singapore-city", label: "Singapore" },
        ],
      },
    ],
  },
];

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Cascader
            label="Region"
            placeholder="Select a region"
            options={regions}
            fullWidth
            classNames={{
              root: "custom-cascader-root",
              label: "custom-cascader-label"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-cascader-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-cascader-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
