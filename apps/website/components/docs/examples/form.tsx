"use client";

import { useState } from "react";
import { Button, CodeBlock, Form, FormError, FormSubmit, Input, useForm } from "@pimolu/react";

export function FormExample() {
  const [submitted, setSubmitted] = useState("");
  const form = useForm({
    defaultValues: { name: "", email: "" },
    validate: (values) => {
      const errors: { name?: string; email?: string } = {};
      if (!values.name.trim()) errors.name = "Enter your name.";
      if (!values.email.trim()) errors.email = "Enter your email address.";
      return errors;
    },
    onSubmit: (values) => {
      setSubmitted(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className="grid gap-5">
      <Form form={form} autoComplete="off" className="grid gap-4">
        <Input label="Your name" {...form.register("name")} fullWidth />
        <FormError name="name" />
        <Input label="Email address" type="email" {...form.register("email")} fullWidth />
        <FormError name="email" />
        <div className="flex flex-wrap gap-3">
          <FormSubmit>Submit form</FormSubmit>
          <Button appearance="outline" onClick={() => { form.reset(); setSubmitted(""); }}>
            Reset
          </Button>
        </div>
      </Form>
      <section aria-label="Current form values" className="grid gap-2">
        <h3>Current values — form.values</h3>
        <p>These values update while you type.</p>
        <CodeBlock code={JSON.stringify(form.values, null, 2)} language="json" wrap />
      </section>
      <section aria-label="Submitted form data" className="grid gap-2">
        <h3>Submitted data — onSubmit(values)</h3>
        <p role="status">
          {submitted ? "Data captured locally. Edit a field to compare current and submitted values." : "Fill both fields and select Submit form. No data is sent to a server."}
        </p>
        {submitted && <CodeBlock code={submitted} language="json" wrap />}
      </section>
    </div>
  );
}
