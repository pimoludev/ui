"use client";

import { Separator } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            <div className="pg-stack">
              <span className="pg-meta">horizontal</span>
              <Separator classNames={{ root: "custom-separator-root" }} />
            </div>
            <div className="pg-separator-row">
              <span>Profile</span>
              <Separator
                orientation="vertical"
                classNames={{
                  root: "custom-separator-root"
                }}
              />
              <span>Settings</span>
              <Separator
                orientation="vertical"
                classNames={{
                  root: "custom-separator-root"
                }}
              />
              <span>Logout</span>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-separator-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
