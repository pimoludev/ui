"use client";

import { typographyVariantMap, Text } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const typographySizes = optionsOf(
  typographyVariantMap.size,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              typographySizes.map((size) => (
                <div key={size} className="pg-row">
                  <span className="pg-meta">{size}</span>
                  <Text size={size} classNames={{ root: "custom-typography-root" }}>
                    The quick brown fox jumps over the lazy dog.
                  </Text>
                </div>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-typography-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
