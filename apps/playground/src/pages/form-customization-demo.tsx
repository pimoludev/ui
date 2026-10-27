"use client";

import { useState } from "react";
import {
  useForm,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Form,
  Input,
  FormError,
  Select,
  Textarea,
  FormSubmit,
  Button
} from "@pimolu/react";

interface SignupValues {
  name: string;
  email: string;
  plan: string;
  notes: string;
}

const emptySignup: SignupValues = {
  name: "",
  email: "",
  plan: "",
  notes: "",
};

function SignupForm() {
  const [created, setCreated] = useState<SignupValues | null>(
    null
  );

  const form = useForm<SignupValues>({
    defaultValues: emptySignup,
    validate: (values) => {
      const errors: Partial<
        Record<keyof SignupValues, string>
      > = {};

      if(!values.name.trim()) {
        errors.name = "Your name is required.";
      }

      if(
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
      ) {
        errors.email = "Enter a valid email address.";
      }

      if(!values.plan) {
        errors.plan = "Choose a plan to continue.";
      }

      return errors;
    },
    onSubmit: async (values) => {
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      setCreated(values);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          The submit button stays disabled while the async handler runs.
          Errors are announced and linked to their field.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          className="pg-stack"
          classNames={{
            root: "custom-form-root",
            label: "custom-form-label"
          }}
        >
          <Input
            label="Full name"
            autoComplete="name"
            required
            fullWidth
            {...form.register("name")}
          />
          <FormError name="name" />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            fullWidth
            {...form.register("email")}
          />
          <FormError name="email" />
          <Select
            label="Plan"
            placeholder="Choose a plan"
            fullWidth
            value={form.values.plan}
            invalid={Boolean(form.errors.plan)}
            aria-describedby={
              form.errors.plan
                ? `${form.formId}-plan-error`
                : undefined
            }
            onValueChange={(value) =>
              form.setValue("plan", value)
            }
          >
            <option value="starter">
              Starter — free forever
            </option>
            <option value="team">
              Team — $24 / month
            </option>
            <option value="business">
              Business — $79 / month
            </option>
          </Select>
          <FormError name="plan" />
          <Textarea
            label="Anything we should know?"
            rows={3}
            fullWidth
            {...form.register("notes")}
          />
          <div className="pg-row">
            <FormSubmit>Create account</FormSubmit>
            <Button
              type="button"
              appearance="ghost"
              onClick={() => {
                form.reset();
                setCreated(null);
              }}
            >
              Reset
            </Button>
          </div>
          {
            created && (
              <p role="status">
                Account created for {created.email} on the{" "}
                {created.plan} plan.
              </p>
            )
          }
        </Form>
      </CardContent>
    </Card>
  );
}

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <SignupForm />
        </>)
      }
      <style>
        {
          `
.custom-form-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-form-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
