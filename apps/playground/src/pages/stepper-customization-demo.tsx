"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Stepper,
  StepperItem
} from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--start">
            <Card>
              <CardHeader>
                <CardTitle>Read-only</CardTitle>
                <CardDescription>
                  The second step is active.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Stepper
                  aria-label="Publishing"
                  defaultActiveStep={2}
                  classNames={{
                    root: "custom-stepper-root",
                    title: "custom-stepper-title"
                  }}
                >
                  <StepperItem step={1} title="Draft" />
                  <StepperItem step={2} title="Review" />
                  <StepperItem step={3} title="Publish" />
                </Stepper>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vertical</CardTitle>
                <CardDescription>
                  A longer path reads better in a column.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Stepper
                  aria-label="Migration"
                  orientation="vertical"
                  defaultActiveStep={3}
                  classNames={{
                    root: "custom-stepper-root",
                    title: "custom-stepper-title"
                  }}
                >
                  <StepperItem
                    step={1}
                    title="Export"
                    description="Download the archive"
                  />
                  <StepperItem
                    step={2}
                    title="Validate"
                    description="Check the schema"
                  />
                  <StepperItem
                    step={3}
                    title="Import"
                    description="Upload the archive"
                  />
                  <StepperItem
                    step={4}
                    title="Verify"
                    description="Run the smoke tests"
                  />
                </Stepper>
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-stepper-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-stepper-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
