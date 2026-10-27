"use client";

import { PasswordInput } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0"
          >
            <PasswordInput
              label="Current password"
              placeholder="Enter your password"
              autoComplete="current-password"
              description="Use the toggle to check what you typed."
              classNames={{
                root: "custom-password-input-root",
                label: "custom-password-input-label"
              }}
            />
            <PasswordInput
              label="New password"
              placeholder="Create a password"
              autoComplete="new-password"
              defaultValue="correct horse battery"
              classNames={{
                root: "custom-password-input-root",
                label: "custom-password-input-label"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-password-input-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-password-input-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
