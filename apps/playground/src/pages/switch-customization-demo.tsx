"use client";

import { switchVariantMap, Switch } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const switchSizes = optionsOf(switchVariantMap.size);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              switchSizes.map((size) => (
                <Switch
                  key={size}
                  size={size}
                  label={size}
                  defaultChecked
                  classNames={{
                    root: "custom-switch-root",
                    label: "custom-switch-label"
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
.custom-switch-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-switch-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
