"use client";

import { spinnerVariantMap, Spinner } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const spinnerAppearances = optionsOf(
  spinnerVariantMap.appearance,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
            {
              spinnerAppearances.map((appearance) => (
                <div key={appearance} className="pg-demo-item">
                  <Spinner
                    appearance={appearance}
                    size="lg"
                    classNames={{
                      root: "custom-spinner-root",
                      label: "custom-spinner-label"
                    }}
                  />
                  <span className="pg-meta">{appearance}</span>
                </div>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-spinner-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-spinner-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
