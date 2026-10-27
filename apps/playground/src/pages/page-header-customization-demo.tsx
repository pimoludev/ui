"use client";

import { PageHeader as DocsPageHeader, Badge } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-panel">
            <DocsPageHeader
              titleAs="h2"
              size="sm"
              eyebrow="Workspace"
              title="Project overview"
              description="Review delivery, ownership and the next milestones."
              meta={<Badge variant="success">On track</Badge>}
              classNames={{
                root: "custom-page-header-root",
                title: "custom-page-header-title"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-page-header-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-page-header-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
