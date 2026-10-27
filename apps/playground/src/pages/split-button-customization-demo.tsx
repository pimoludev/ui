"use client";

import { SplitButton, type PimoluSplitButtonItem } from "@pimolu/react";

const exportItems: PimoluSplitButtonItem[] = [
  { id: "pdf", label: "Export as PDF" },
  { id: "markdown", label: "Export as Markdown" },
  { id: "html", label: "Export as HTML" },
];

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
            <SplitButton
              items={exportItems}
              aria-label="Export"
              classNames={{
                root: "custom-split-button-root",
                primary: "custom-split-button-primary"
              }}
            >
              Export
            </SplitButton>
            <SplitButton
              items={exportItems}
              variant="secondary"
              appearance="soft"
              aria-label="Export soft"
              classNames={{
                root: "custom-split-button-root",
                primary: "custom-split-button-primary"
              }}
            >
              Export
            </SplitButton>
            <SplitButton
              items={exportItems}
              variant="neutral"
              appearance="outline"
              size="lg"
              aria-label="Export large"
              classNames={{
                root: "custom-split-button-root",
                primary: "custom-split-button-primary"
              }}
            >
              Export
            </SplitButton>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-split-button-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-split-button-primary {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
