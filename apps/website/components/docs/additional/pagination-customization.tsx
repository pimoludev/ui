"use client";

import { Pagination } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="grid gap-5 min-w-0">
              <span className="text-sm text-muted leading-relaxed">sm</span>
              <Pagination
                pageCount={12}
                defaultPage={5}
                size="sm"
                aria-label="Pagination, sm"
                classNames={{
                  root: "custom-pagination-root"
                }}
              />
            </div>
            <div className="grid gap-5 min-w-0">
              <span className="text-sm text-muted leading-relaxed">md</span>
              <Pagination
                pageCount={12}
                defaultPage={5}
                size="md"
                aria-label="Pagination, md"
                classNames={{
                  root: "custom-pagination-root"
                }}
              />
            </div>
            <div className="grid gap-5 min-w-0">
              <span className="text-sm text-muted leading-relaxed">lg</span>
              <Pagination
                pageCount={12}
                defaultPage={5}
                size="lg"
                aria-label="Pagination, lg"
                classNames={{
                  root: "custom-pagination-root"
                }}
              />
            </div>
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
    </div>
  );
}
