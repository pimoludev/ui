"use client";

import { Signature } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--start">
            <Signature
              label="Signature"
              description={(
                "Sign above the line. The pad is 600 by 200 CSS pixels and " +
                "scales down with its container."
              )}
              classNames={{
                root: "custom-signature-root",
                label: "custom-signature-label"
              }}
            />
            <Signature
              label="Signature with undo"
              undo
              clearLabel="Clear and start over"
              penColor="#1d4ed8"
              lineWidth={3}
              classNames={{
                root: "custom-signature-root",
                label: "custom-signature-label"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-signature-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-signature-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
