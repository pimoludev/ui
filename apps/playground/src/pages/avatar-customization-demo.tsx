"use client";

import { avatarVariantMap, Avatar } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const avatarSizes = optionsOf(avatarVariantMap.size);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-row">
            {
              avatarSizes.map((size) => (
                <Avatar
                  key={size}
                  name="Jean Dupont"
                  size={size}
                  classNames={{
                    root: "custom-avatar-root"
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
.custom-avatar-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
