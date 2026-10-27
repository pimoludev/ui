"use client";

import { textareaVariantMap, Textarea } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const textareaSizes = optionsOf(textareaVariantMap.size);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              textareaSizes.map((size) => (
                <Textarea
                  key={size}
                  size={size}
                  label={size}
                  placeholder="Placeholder"
                  rows={2}
                  classNames={{
                    root: "custom-textarea-root",
                    label: "custom-textarea-label"
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
.custom-textarea-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-textarea-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
