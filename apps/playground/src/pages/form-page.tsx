import { CustomizationExample } from "./form-customization-demo";
import { useState } from "react";
import { NativeMotionDemo } from "./native-motion-demo";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormError,
  FormSubmit,
  Input,
  Select,
  Spinner,
  Textarea,
  useForm,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   SIGNUP EXAMPLE
========================================= */

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

      if (!values.name.trim()) {
        errors.name = "Your name is required.";
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
      ) {
        errors.email = "Enter a valid email address.";
      }

      if (!values.plan) {
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
          The submit button stays disabled while the async
          handler runs. Errors are announced and linked to
          their field.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form form={form} className="pg-stack">
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

          {created && (
            <p role="status">
              Account created for {created.email} on the{" "}
              {created.plan} plan.
            </p>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}

/* =========================================
   PREFILL AND RESET
========================================= */

function PrefillForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },

    onSubmit: async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );
    },
  });

  return (
    <Form form={form} className="pg-stack">
      <Input
        label="Name"
        fullWidth
        {...form.register("name")}
      />

      <Input
        label="Email"
        type="email"
        fullWidth
        {...form.register("email")}
      />

      <div className="pg-row">
        <Button
          type="button"
          onClick={() =>
            form.setValues({
              name: "Ada Lovelace",
              email: "ada@example.com",
            })
          }
        >
          Fill demo values
        </Button>

        <Button
          type="button"
          appearance="ghost"
          onClick={() => form.reset()}
        >
          Reset
        </Button>

        <FormSubmit>Save</FormSubmit>
      </div>

      <pre aria-live="polite">
        {JSON.stringify(form.values, null, 2)}
      </pre>
    </Form>
  );
}

/* =========================================
   PAGE
========================================= */

export function FormPage() {
  return (
    <>
      <PageHeader
        title="Form"
        hint="A small validation orchestrator built on useForm: values, errors, setValue/setValues, register, reset, async submit and an isSubmitting flag. Form renders a native form with noValidate on by default; FormError and FormSubmit read the same context. Use it with Input, Textarea and native controls, or drive Select and the other onValueChange components explicitly."
      />

      <Section
        title="Validation and async submit"
        hint="validate returns a map of messages. When it finds one, onSubmit is never called; as soon as a field changes, its message is cleared."
      >
        <SignupForm />
      </Section>

      <Section
        title="Prefill, reset and inspect"
        hint="setValues merges several fields at once, reset returns to defaultValues and clears every error. values is a plain object you can read at any time."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <PrefillForm />
          </div>
        </div>
      </Section>

      <Section
        title="Native constraints"
        hint="noValidate defaults to true so the component owns the error UI. Set it to false to let the browser enforce required, type and pattern too."
      >
        <div className="pg-grid">
          <div className="pg-panel">
            <NativeForm />
          </div>
        </div>
      </Section>
      <Section title="FormSubmit: custom loading" hint="FormSubmit inherits Button presentation and loadingIndicator. Form owns the pending state and submit type; the custom indicator stays decorative.">
        <CustomSubmitExample />
      </Section>
      <Section title="FormError: field feedback" hint="FormError reads the matching name from Form context. It appears only for an error, announces it, and is associated with register's control.">
        <FieldErrorExample />
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
    <Section title="Native motion" hint="Validation feedback and pending submission animate without moving the form itself. Compare native animations with an instant subtree."><NativeMotionDemo /></Section>
</>
  );
}

function NativeForm() {
  const form = useForm({
    defaultValues: { email: "" },
  });

  return (
    <Form form={form} noValidate={false} className="pg-stack">
      <Input
        label="Work email"
        type="email"
        required
        fullWidth
        {...form.register("email")}
      />

      <FormSubmit>Subscribe</FormSubmit>
    </Form>
  );
}

function CustomSubmitExample() {
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: { name: "Ada" },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMessage("Saved locally: " + values.name);
    },
  });
  return <Form form={form} autoComplete="off" className="pg-panel pg-stack">
    <Input label="Name" {...form.register("name")} fullWidth />
    <FormSubmit loadingIndicator={<Spinner appearance="dots" size="sm" variant="warning" decorative />}>
      {form.isSubmitting ? "Saving…" : "Save locally"}
    </FormSubmit>
    <p role="status">{message}</p>
  </Form>;
}

function FieldErrorExample() {
  const form = useForm({
    defaultValues: { name: "" },
    validate: (values) => values.name.trim() ? {} : { name: "Enter your name." },
  });
  return <Form form={form} autoComplete="off" className="pg-panel pg-stack">
    <Input label="Name" {...form.register("name")} fullWidth />
    <FormError name="name" classNames={{ error: "custom-field-error" }} />
    <div className="pg-row">
      <FormSubmit>Validate</FormSubmit>
      <Button onClick={() => form.setError("name", "This name is already used (simulated server response).")}>Simulate server error</Button>
      <Button appearance="ghost" onClick={() => form.clearErrors("name")}>Clear error</Button>
    </div>
    <style>{`.custom-field-error { font-weight: 600; border-inline-start: 3px solid currentColor; padding-inline-start: 12px; }`}</style>
  </Form>;
}
