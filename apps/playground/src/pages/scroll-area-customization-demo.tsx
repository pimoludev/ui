"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  ScrollArea
} from "@pimolu/react";

const items = Array.from(
  { length: 14 },
  (_, index) => ({
    title: `Release ${14 - index}`,
    meta: `2026-10-${String(19 - index).padStart(2, "0")}`,
  })
);

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <Card>
            <CardHeader>
              <CardTitle>Releases</CardTitle>
              <CardDescription>
                Fourteen rows in a 260px viewport.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea
                maxHeight={260}
                classNames={{ root: "custom-scroll-area-root" }}
              >
                <div className="pg-stack">
                  {
                    items.map((item) => (
                      <div
                        key={item.title}
                        className="pg-row pg-row--between"
                      >
                        <span>{item.title}</span>
                        <span className="pg-meta">{item.meta}</span>
                      </div>
                    ))
                  }
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </>)
      }
      <style>
        {
          `
.custom-scroll-area-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
