"use client";

import { useState } from "react";
import { Button, Form, FormError, FormSubmit, Input, useForm } from "@pimolu/react";

export function FormExample() {
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: { name: "" },
    validate: (values) => values.name.trim() ? {} : { name: "Enter your name to continue." },
    onSubmit: (values) => { setMessage(`Welcome, ${values.name.trim()}. This example stays on your device.`); },
  });
  return <Form form={form} className="space-y-5">
    <Input label="Your name" {...form.register("name")} fullWidth />
    <FormError name="name" />
    <div className="flex flex-wrap gap-3"><FormSubmit>Join the workspace</FormSubmit><Button appearance="outline" onClick={() => { form.reset(); setMessage(""); }}>Reset</Button></div>
    <p role="status">{message}</p>
  </Form>;
}
