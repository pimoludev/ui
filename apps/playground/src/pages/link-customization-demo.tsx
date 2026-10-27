"use client";

import { linkVariantMap, Link } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const linkVariants = optionsOf(
  linkVariantMap.variant,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              linkVariants.map((variant) => (
                <div key={variant} className="pg-row">
                  <span className="pg-meta">{variant}</span>
                  <Link
                    href="#/link"
                    variant={variant}
                    classNames={{
                      root: "custom-link-root"
                    }}
                  >
                    Read the documentation
                  </Link>
                </div>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-link-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
