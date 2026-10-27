"use client";

import { progressVariantMap, Progress } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const progressSizes = optionsOf(progressVariantMap.size);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--start">
            {
              progressSizes.map((size) => (
                <div key={size} className="pg-demo-item">
                  <Progress
                    label={`Size ${size}`}
                    size={size}
                    value={60}
                    classNames={{
                      root: "custom-progress-root",
                      label: "custom-progress-label"
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
.custom-progress-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-progress-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
