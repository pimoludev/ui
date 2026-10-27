import { CustomizationExample } from "./stepper-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Stepper,
  StepperItem,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function ControlledStepper() {
  const [step, setStep] = useState(2);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Badge variant="primary">step {step}</Badge>

        <Button
          size="sm"
          appearance="outline"
          disabled={step <= 1}
          onClick={() => setStep((current) => current - 1)}
        >
          Back
        </Button>

        <Button
          size="sm"
          disabled={step >= 4}
          onClick={() => setStep((current) => current + 1)}
        >
          Next
        </Button>
      </div>

      <Stepper
        aria-label="Onboarding"
        activeStep={step}
        onStepChange={setStep}
        clickable
      >
        <StepperItem
          step={1}
          title="Account"
          description="Create an account"
        />

        <StepperItem
          step={2}
          title="Workspace"
          description="Name your workspace"
        />

        <StepperItem
          step={3}
          title="Team"
          description="Invite teammates"
        />

        <StepperItem
          step={4}
          title="Billing"
          description="Choose a plan"
        />
      </Stepper>
    </div>
  );
}

export function StepperPage() {
  return (
    <>
      <PageHeader
        title="Stepper"
        hint="A visual path through several steps, horizontal or vertical, read-only or clickable, with completed, active, upcoming and disabled states. Styles come from @pimolu/web-styles/stepper.css."
      />

      <Section
        title="Controlled"
        hint="activeStep and onStepChange drive the progression; the buttons below change it from outside."
      >
        <ControlledStepper />
      </Section>

      <Section
        title="Read-only and vertical"
        hint="Without clickable, the steps are informational; vertical stacks markers and text."
      >
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
      </Section>

      <Section
        title="Disabled"
        hint="A disabled step is skipped by the clickable navigation."
      >
        <Stepper
          aria-label="Checkout"
          defaultActiveStep={1}
          clickable
        >
          <StepperItem step={1} title="Account" />
          <StepperItem step={2} title="Shipping" disabled />
          <StepperItem step={3} title="Payment" />
        </Stepper>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
