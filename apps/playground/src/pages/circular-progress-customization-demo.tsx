"use client";

import { circularProgressVariantMap, CircularProgress } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const circularProgressSizes = optionsOf(
  circularProgressVariantMap.size,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
            {
              circularProgressSizes.map((size) => (
                <div key={size} className="pg-demo-item">
                  <CircularProgress
                    size={size}
                    value={65}
                    showValue
                    label={`Size ${size}`}
                    classNames={{
                      root: "custom-circular-progress-root",
                      value: "custom-circular-progress-value"
                    }}
                  />
                  <span className="pg-meta">{size}</span>
                </div>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-circular-progress-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-circular-progress-value {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
