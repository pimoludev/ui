"use client";

import { ButtonGroup, Button } from "@pimolu/react";
import { type ReactNode } from "react";

function FormatButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Button
      iconOnly
      appearance="outline"
      aria-label={label}
      startIcon={<span>{children}</span>}
    />
  );
}

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
            <ButtonGroup
              aria-label="Text formatting"
              classNames={{
                root: "custom-button-group-root"
              }}
            >
              <FormatButton label="Bold">B</FormatButton>
              <FormatButton label="Italic">I</FormatButton>
              <FormatButton label="Underline">U</FormatButton>
            </ButtonGroup>
            <ButtonGroup
              aria-label="Alignment"
              classNames={{
                root: "custom-button-group-root"
              }}
            >
              <FormatButton label="Align left">⇤</FormatButton>
              <FormatButton label="Align center">↔</FormatButton>
              <FormatButton label="Align right">⇥</FormatButton>
            </ButtonGroup>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-button-group-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
