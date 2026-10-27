"use client";

import { checkboxVariantMap, Checkbox } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const checkboxSizes = optionsOf(checkboxVariantMap.size);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              checkboxSizes.map((size) => (
                <Checkbox
                  key={size}
                  size={size}
                  label={size}
                  defaultChecked
                  classNames={{
                    root: "custom-checkbox-root",
                    label: "custom-checkbox-label"
                  }}
                />
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-checkbox-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-checkbox-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
