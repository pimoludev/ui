"use client";

import { useState } from "react";
import { Form, FormSubmit, Input, useForm } from "@pimolu/react";

export function FormSubmitExample() {
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: { name: "Ada" },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Saved locally: " + values.name);
    },
  });

  return (
    <Form form={form} autoComplete="off" className="grid gap-4">
      <Input label="Name" {...form.register("name")} />
      <FormSubmit>{form.isSubmitting ? "Saving…" : "Save profile"}</FormSubmit>
      <p role="status">{message}</p>
    </Form>
  );
}
