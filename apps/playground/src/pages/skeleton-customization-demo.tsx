"use client";

import { skeletonVariantMap, Skeleton } from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const skeletonShapes = optionsOf(
  skeletonVariantMap.shape,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              skeletonShapes.map((shape) => (
                <div key={shape} className="pg-demo-item">
                  <span className="pg-meta">{shape}</span>
                  {
                    shape === "circular"
                      ? (
                        <Skeleton
                          shape={shape}
                          animation="none"
                          width={48}
                          height={48}
                          classNames={{ root: "custom-skeleton-root" }}
                        />
                      )
                      : (
                        <Skeleton
                          shape={shape}
                          animation="none"
                          width="100%"
                          height={16}
                          classNames={{ root: "custom-skeleton-root" }}
                        />
                      )
                  }
                </div>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-skeleton-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
