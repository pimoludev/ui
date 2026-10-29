"use client";

import { useState } from "react";
import { Form, FormSubmit, useForm } from "@pimolu/react";

export function DemoExample() {
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: {},
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setMessage("Local operation completed.");
    },
  });

  return (
    <Form form={form} className="grid gap-4">
      <div className="flex flex-wrap gap-3">
        <FormSubmit appearance="solid">Save</FormSubmit>
        <FormSubmit appearance="outline" variant="success">Confirm</FormSubmit>
        <FormSubmit appearance="soft" size="sm">Quick save</FormSubmit>
      </div>
      <p role="status">{message}</p>
    </Form>
  );
}
