"use client";

import { ApiTable } from "@pimolu/react";

const buttonRows = [
  {
    name: "variant",
    type: '"primary" | "secondary" | "danger"',
    default: '"primary"',
    description: "Semantic colour of the action. It maps to the same token in every preset.",
  },
  {
    name: "appearance",
    type: '"solid" | "soft" | "outline" | "ghost" | "glass"',
    default: '"solid"',
    description: "Visual weight of the button without changing its meaning.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "md" | "lg" | "xl" | "xxl"',
    default: '"md"',
    description: "Control height and horizontal padding. md matches the default form controls.",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Visible label. Provide an aria-label instead when the button is icon-only.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows a spinner, disables the control and sets aria-busy.",
  },
  {
    name: "startIcon",
    type: "ReactNode",
    description: "Decorative icon rendered before the label; it is hidden from assistive technology.",
  },
  {
    name: "onClick",
    type: "(event: MouseEvent) => void",
    description: "Native click handler. The button does not intercept the event.",
  },
  {
    name: "fullWidth",
    type: "boolean",
    default: "false",
    description: "Stretches the button to the inline size of its container.",
  },
  {
    name: "iconOnly",
    type: "boolean",
    default: "false",
    deprecated: true,
    description: "Use the icon-only variant instead. The prop remains for one major version.",
  },
];

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="min-w-0 rounded-lg border border-border p-6">
            <ApiTable
              title="Button"
              caption="Every prop accepted by Button, with its type and default value."
              rows={buttonRows}
              classNames={{
                root: "custom-api-table-root",
                title: "custom-api-table-title"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-api-table-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-api-table-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
