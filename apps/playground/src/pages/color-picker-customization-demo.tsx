"use client";

import { Card, CardHeader, CardTitle, CardContent, ColorPicker } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--start">
            {
              (["sm", "md", "lg"] as const).map((size) => (
                <Card key={size}>
                  <CardHeader>
                    <CardTitle>
                      {size}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ColorPicker
                      label="Surface color"
                      defaultValue="#10B981"
                      size={size}
                      classNames={{
                        root: "custom-color-picker-root",
                        label: "custom-color-picker-label"
                      }}
                    />
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
.custom-color-picker-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-color-picker-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
