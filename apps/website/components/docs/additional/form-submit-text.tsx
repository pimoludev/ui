"use client";

import { useState } from "react";
import { Form, FormSubmit, useForm } from "@pimolu/react";

export function DemoExample() {
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: {},
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMessage("Export prepared locally.");
    },
  });

  return (
    <Form form={form} className="grid gap-4">
      <FormSubmit loadingIndicator={null} appearance="outline">
        {form.isSubmitting ? "Preparing export…" : "Prepare export"}
      </FormSubmit>
      <p role="status">{message}</p>
    </Form>
  );
}
