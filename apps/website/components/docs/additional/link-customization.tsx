"use client";

import { Link } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">primary</span>
              <Link
                href="#/link"
                variant="primary"
                classNames={{
                  root: "custom-link-root"
                }}
              >
                Read the documentation
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">muted</span>
              <Link
                href="#/link"
                variant="muted"
                classNames={{
                  root: "custom-link-root"
                }}
              >
                Read the documentation
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-muted leading-relaxed">inherit</span>
              <Link
                href="#/link"
                variant="inherit"
                classNames={{
                  root: "custom-link-root"
                }}
              >
                Read the documentation
              </Link>
            </div>
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
    </div>
  );
}
