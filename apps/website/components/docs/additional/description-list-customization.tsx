"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DescriptionList,
  DescriptionItem,
  Badge
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            <Card>
              <CardHeader>
                <CardTitle>stacked</CardTitle>
              </CardHeader>
              <CardContent>
                <DescriptionList
                  layout="stacked"
                  classNames={{
                    root: "custom-description-list-root",
                    item: "custom-description-list-item"
                  }}
                >
                  <DescriptionItem
                    term="Status"
                    details={<Badge variant="success">Active</Badge>}
                  />
                  <DescriptionItem term="Owner" details="Ada Lovelace" />
                  <DescriptionItem term="Region" details="eu-west-3" />
                </DescriptionList>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>inline</CardTitle>
              </CardHeader>
              <CardContent>
                <DescriptionList
                  layout="inline"
                  classNames={{
                    root: "custom-description-list-root",
                    item: "custom-description-list-item"
                  }}
                >
                  <DescriptionItem
                    term="Status"
                    details={<Badge variant="success">Active</Badge>}
                  />
                  <DescriptionItem term="Owner" details="Ada Lovelace" />
                  <DescriptionItem term="Region" details="eu-west-3" />
                </DescriptionList>
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-description-list-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-description-list-item {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
