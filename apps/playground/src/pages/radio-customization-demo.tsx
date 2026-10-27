"use client";

import { radioVariantMap, RadioGroup, Radio } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const radioSizes = optionsOf(radioVariantMap.size);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              radioSizes.map((size) => (
                <RadioGroup
                  key={size}
                  size={size}
                  orientation="horizontal"
                  defaultValue="a"
                  label={size}
                  classNames={{
                    root: "custom-radio-root",
                    label: "custom-radio-label"
                  }}
                >
                  <Radio
                    value="a"
                    label="Selected"
                    classNames={{
                      root: "custom-radio-root",
                      label: "custom-radio-label"
                    }}
                  />
                  <Radio
                    value="b"
                    label="Other"
                    classNames={{
                      root: "custom-radio-root",
                      label: "custom-radio-label"
                    }}
                  />
                </RadioGroup>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-radio-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-radio-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
