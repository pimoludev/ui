"use client";

import { paginationVariantMap, Pagination } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const paginationSizes = optionsOf(
  paginationVariantMap.size,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              paginationSizes.map((size) => (
                <div key={size} className="pg-stack">
                  <span className="pg-meta">{size}</span>
                  <Pagination
                    pageCount={12}
                    defaultPage={5}
                    size={size}
                    aria-label={`Pagination, ${size}`}
                    classNames={{
                      root: "custom-pagination-root"
                    }}
                  />
                </div>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-pagination-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
