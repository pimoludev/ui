"use client";

import {
  descriptionListVariantMap,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DescriptionList,
  DescriptionItem,
  Badge
} from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const descriptionListLayouts = optionsOf(
  descriptionListVariantMap.layout,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--two pg-grid--start">
            {
              descriptionListLayouts.map((layout) => (
                <Card key={layout}>
                  <CardHeader>
                    <CardTitle>
                      {layout}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DescriptionList
                      layout={layout}
                      classNames={{
                        root: "custom-description-list-root",
                        item: "custom-description-list-item"
                      }}
                    >
                      <DescriptionItem
                        term="Status"
                        details={<Badge variant="success">Active</Badge>}
                      />
                      <DescriptionItem
                        term="Owner"
                        details="Ada Lovelace"
                      />
                      <DescriptionItem
                        term="Region"
                        details="eu-west-3"
                      />
                    </DescriptionList>
                  </CardContent>
                </Card>
              ))
            }
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
    </>
  );
}
