"use client";

import { Avatar } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <Avatar
              name="Jean Dupont"
              size="xs"
              classNames={{ root: "custom-avatar-root" }}
            />
            <Avatar
              name="Jean Dupont"
              size="sm"
              classNames={{ root: "custom-avatar-root" }}
            />
            <Avatar
              name="Jean Dupont"
              size="md"
              classNames={{ root: "custom-avatar-root" }}
            />
            <Avatar
              name="Jean Dupont"
              size="lg"
              classNames={{ root: "custom-avatar-root" }}
            />
            <Avatar
              name="Jean Dupont"
              size="xl"
              classNames={{ root: "custom-avatar-root" }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-avatar-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
