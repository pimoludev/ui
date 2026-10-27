"use client";

import { Skeleton } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="grid gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">text</span>
              {
                <Skeleton
                  shape="text"
                  animation="none"
                  width="100%"
                  height={16}
                  classNames={{
                    root: "custom-skeleton-root"
                  }}
                />
              }
            </div>
            <div className="grid gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">rectangular</span>
              {
                <Skeleton
                  shape="rectangular"
                  animation="none"
                  width="100%"
                  height={16}
                  classNames={{
                    root: "custom-skeleton-root"
                  }}
                />
              }
            </div>
            <div className="grid gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">rounded</span>
              {
                <Skeleton
                  shape="rounded"
                  animation="none"
                  width="100%"
                  height={16}
                  classNames={{
                    root: "custom-skeleton-root"
                  }}
                />
              }
            </div>
            <div className="grid gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">circular</span>
              {
                <Skeleton
                  shape="circular"
                  animation="none"
                  width={48}
                  height={48}
                  classNames={{
                    root: "custom-skeleton-root"
                  }}
                />
              }
            </div>
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
    </div>
  );
}
