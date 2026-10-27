"use client";

import { badgeVariantMap, Badge } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const badgeSizes = optionsOf(badgeVariantMap.size);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
            {
              badgeSizes.map((size) => (
                <Badge
                  key={size}
                  size={size}
                  classNames={{
                    root: "custom-badge-root",
                    label: "custom-badge-label"
                  }}
                >
                  {size}
                </Badge>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-badge-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-badge-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
