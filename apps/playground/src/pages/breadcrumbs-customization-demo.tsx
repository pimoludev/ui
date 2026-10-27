"use client";

import {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <Breadcrumbs
            classNames={{
              root: "custom-breadcrumbs-root",
              item: "custom-breadcrumbs-item"
            }}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="#/overview">
                Overview
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#/card">
                Components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumbs>
        </>)
      }
      <style>
        {
          `
.custom-breadcrumbs-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-breadcrumbs-item {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
