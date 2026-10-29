"use client";

import { useState } from "react";
import { Checkbox, Form, FormSubmit, useForm } from "@pimolu/react";

export function DemoExample() {
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: {},
    onSubmit: () => setMessage("Preferences saved locally."),
  });

  return (
    <Form form={form} className="grid gap-4">
      <Checkbox
        checked={accepted}
        onCheckedChange={setAccepted}
        label="I have reviewed these preferences"
      />
      <p>Review the preferences to enable the submit button.</p>
      <FormSubmit disabled={!accepted} fullWidth>Save preferences</FormSubmit>
      <p role="status">{message}</p>
    </Form>
  );
}
