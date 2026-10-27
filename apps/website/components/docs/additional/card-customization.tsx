"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0"
          >
            <Card
              size="sm"
              classNames={{
                root: "custom-card-root",
                title: "custom-card-title"
              }}
            >
              <CardHeader>
                <CardTitle>sm</CardTitle>
                <CardDescription>Padding, gap and title size follow the size.</CardDescription>
              </CardHeader>
              <CardContent>
                Body content for the sm size.
              </CardContent>
            </Card>
            <Card
              size="md"
              classNames={{
                root: "custom-card-root",
                title: "custom-card-title"
              }}
            >
              <CardHeader>
                <CardTitle>md</CardTitle>
                <CardDescription>Padding, gap and title size follow the size.</CardDescription>
              </CardHeader>
              <CardContent>
                Body content for the md size.
              </CardContent>
            </Card>
            <Card
              size="lg"
              classNames={{
                root: "custom-card-root",
                title: "custom-card-title"
              }}
            >
              <CardHeader>
                <CardTitle>lg</CardTitle>
                <CardDescription>Padding, gap and title size follow the size.</CardDescription>
              </CardHeader>
              <CardContent>
                Body content for the lg size.
              </CardContent>
            </Card>
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
    </div>
  );
}
