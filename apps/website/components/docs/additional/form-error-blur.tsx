"use client";

import { Form, FormError, Input, useForm } from "@pimolu/react";

export function DemoExample() {
  const form = useForm({ defaultValues: { email: "" } });

  return (
    <Form form={form} autoComplete="off" className="grid gap-4">
      <p>Leave the empty email field to show feedback. Editing clears it.</p>
      <Input
        label="Email"
        type="email"
        {...form.register("email")}
        onBlur={() => form.setError("email", form.values.email.trim() ? undefined : "Enter your email.")}
      />
      <FormError name="email" />
    </Form>
  );
}
