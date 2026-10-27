"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  LoadingOverlay,
  Label,
  Input,
  Button
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
                <CardTitle>Saving settings</CardTitle>
                <CardDescription>
                  A form is covered while the server persists it; the controls
                  cannot be focused behind the overlay.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoadingOverlay
                  label="Saving changes"
                  description="Keep this tab open until the save completes."
                  classNames={{
                    root: "custom-loading-overlay-root",
                    label: "custom-loading-overlay-label"
                  }}
                >
                  <div className="grid gap-5 min-w-0">
                    <div className="grid gap-5 min-w-0">
                      <Label htmlFor="loading-overlay-name-custom-parts">Workspace name</Label>
                      <Input
                        id="loading-overlay-name-custom-parts"
                        defaultValue="Project Atlas"
                      />
                    </div>
                    <div className="grid gap-5 min-w-0">
                      <Label htmlFor="loading-overlay-slug-custom-parts">Slug</Label>
                      <Input
                        id="loading-overlay-slug-custom-parts"
                        defaultValue="project-atlas"
                      />
                    </div>
                    <Button size="sm">Save changes</Button>
                  </div>
                </LoadingOverlay>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Preparing an export</CardTitle>
                <CardDescription>
                  A small region with a custom description, without any covered
                  content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoadingOverlay
                  label="Building the CSV"
                  description="Rows are streamed from the archive."
                  classNames={{
                    root: "custom-loading-overlay-root",
                    label: "custom-loading-overlay-label"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>
                  The exact same overlay closes over the payment summary.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoadingOverlay
                  label="Processing payment"
                  classNames={{
                    root: "custom-loading-overlay-root",
                    label: "custom-loading-overlay-label"
                  }}
                >
                  <div className="grid gap-5 min-w-0">
                    <div
                      className="flex flex-wrap items-center gap-3 min-w-0 justify-between"
                    >
                      <span className="text-sm text-muted leading-relaxed">Team plan · yearly</span>
                      <span className="text-2xl font-medium">€240.00</span>
                    </div>
                    <div
                      className="flex flex-wrap items-center gap-3 min-w-0 justify-between"
                    >
                      <span className="text-sm text-muted leading-relaxed">VAT (20%)</span>
                      <span className="text-sm text-muted leading-relaxed">€48.00</span>
                    </div>
                    <div
                      className="flex flex-wrap items-center gap-3 min-w-0 justify-between"
                    >
                      <span>Total</span>
                      <span className="text-2xl font-medium">€288.00</span>
                    </div>
                  </div>
                </LoadingOverlay>
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-loading-overlay-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-loading-overlay-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
