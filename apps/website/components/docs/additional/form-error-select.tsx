"use client";

import { useState } from "react";
import { Form, FormError, FormSubmit, Select, useForm } from "@pimolu/react";

export function DemoExample() {
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: { role: "" },
    validate: (values) => values.role ? {} : { role: "Choose a role." },
    onSubmit: (values) => setMessage("Selected role: " + values.role),
  });

  return (
    <Form form={form} className="grid gap-4">
      <Select
        label="Role"
        name="role"
        value={form.values.role}
        onValueChange={(value) => form.setValue("role", value)}
        aria-invalid={Boolean(form.errors.role)}
        aria-describedby={form.errors.role ? form.formId + "-role-error" : undefined}
      >
        <option value="">Choose a role</option>
        <option value="designer">Designer</option>
        <option value="developer">Developer</option>
      </Select>
      <FormError name="role" />
      <FormSubmit>Confirm role</FormSubmit>
      <p role="status">{message}</p>
    </Form>
  );
}
