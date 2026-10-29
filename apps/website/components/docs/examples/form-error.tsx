"use client";

import { useState } from "react";
import { Form, FormError, FormSubmit, Input, useForm } from "@pimolu/react";

export function FormErrorExample() {
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: { name: "" },
    validate: (values) => values.name.trim() ? {} : { name: "Enter your name." },
    onSubmit: (values) => setMessage("Validated: " + values.name),
  });

  return (
    <Form form={form} autoComplete="off" className="grid gap-4">
      <Input label="Name" {...form.register("name")} />
      <FormError name="name" />
      <FormSubmit>Validate profile</FormSubmit>
      <p role="status">{message}</p>
    </Form>
  );
}
