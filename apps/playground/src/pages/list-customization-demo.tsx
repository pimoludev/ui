"use client";

import {
  listVariantMap,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  List,
  ListItem
} from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const listVariants = optionsOf(
  listVariantMap.variant,
);

const listSizes = optionsOf(
  listVariantMap.size,
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--two pg-grid--start">
            {
              listVariants.map((variant) => (
                <Card key={variant}>
                  <CardHeader>
                    <CardTitle>
                      {variant}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <List
                      variant={variant}
                      classNames={{
                        root: "custom-list-root",
                        title: "custom-list-title"
                      }}
                    >
                      <ListItem
                        title="Design tokens"
                        description="Colours and spacing"
                      />
                      <ListItem
                        title="Themes"
                        description="Light and dark"
                      />
                    </List>
                  </CardContent>
                </Card>
              ))
            }
          </div>
          <div className="pg-stack">
            {
              listSizes.map((size) => (
                <div key={size} className="pg-stack">
                  <span className="pg-meta">{size}</span>
                  <List
                    size={size}
                    variant="divided"
                    classNames={{
                      root: "custom-list-root",
                      title: "custom-list-title"
                    }}
                  >
                    <ListItem
                      title="Design tokens"
                      description="Colours and spacing"
                    />
                    <ListItem
                      title="Themes"
                      description="Light and dark"
                    />
                  </List>
                </div>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-list-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-list-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
