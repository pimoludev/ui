"use client";

import {
  Watermark,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge
} from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <Watermark
            text="CONFIDENTIAL"
            classNames={{
              root: "custom-watermark-root",
              content: "custom-watermark-content"
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Invoice 2026-042</CardTitle>
                <CardDescription>
                  Pimolu Studio · 14 May 2026
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="pg-copy">
                  Design system audit, component library maintenance and
                  documentation. This preview is watermarked for internal review
                  only.
                </p>
              </CardContent>
              <CardFooter>
                <Badge variant="primary">€ 4,800.00</Badge>
                <Badge variant="secondary">Paid</Badge>
              </CardFooter>
            </Card>
          </Watermark>
        </>)
      }
      <style>
        {
          `
.custom-watermark-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-watermark-content {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
