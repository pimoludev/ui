"use client";

import { Card, CardHeader, CardTitle, CardContent, Rating } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            {
              (["sm", "md", "lg"] as const).map((size) => (<Card key={size}>
                <CardHeader>
                  <CardTitle>
                    {size}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Rating
                    label="Build quality"
                    defaultValue={4}
                    size={size}
                    classNames={{
                      root: "custom-rating-root",
                      label: "custom-rating-label"
                    }}
                  />
                </CardContent>
              </Card>))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-rating-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-rating-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
