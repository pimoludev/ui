"use client";

import { SearchInput } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <SearchInput
            label="Search Pimolu UI"
            placeholder="Search components, tokens, guides…"
            shortcut="/"
            classNames={{
              root: "custom-search-input-root"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-search-input-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
