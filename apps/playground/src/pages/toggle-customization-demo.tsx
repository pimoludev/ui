"use client";

import { toggleVariantMap, Toggle } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const toggleVariants = optionsOf(
  toggleVariantMap.variant,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              toggleVariants.map((variant) => (
                <div key={variant} className="pg-row">
                  <span className="pg-meta">{variant}</span>
                  <Toggle variant={variant} classNames={{ root: "custom-toggle-root" }}>
                    Off
                  </Toggle>
                  <Toggle
                    variant={variant}
                    defaultPressed
                    classNames={{
                      root: "custom-toggle-root"
                    }}
                  >
                    On
                  </Toggle>
                </div>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-toggle-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
