"use client";

import {
  cardVariantMap,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@pimolu/react";

function optionsOf<T extends Record<string, string>>(
  group: T,
): Array<keyof T> {
  return Object.keys(group) as Array<keyof T>;
}

const cardSizes = optionsOf(cardVariantMap.size);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid">
            {
              cardSizes.map((size) => (
                <Card
                  key={size}
                  size={size}
                  classNames={{
                    root: "custom-card-root",
                    title: "custom-card-title"
                  }}
                >
                  <CardHeader>
                    <CardTitle>
                      {size}
                    </CardTitle>
                    <CardDescription>
                      Padding, gap and title size follow the size.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    Body content for the {size} size.
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
.custom-card-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-card-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
