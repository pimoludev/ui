"use client";

import { Button, Form, FormError, Input, useForm } from "@pimolu/react";

export function DemoExample() {
  const form = useForm({ defaultValues: { username: "Ada" } });

  return (
    <Form form={form} autoComplete="off" className="grid gap-4">
      <Input label="Username" {...form.register("username")} />
      <FormError name="username" classNames={{ root: "custom-form-error-root", error: "username-feedback" }} />
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => form.setError("username", "This username is unavailable. Try another.")}>
          Simulate a conflict
        </Button>
        <Button appearance="outline" onClick={() => form.clearErrors("username")}>
          Clear feedback
        </Button>
      </div>
      <style>{`
.username-feedback {
  border-inline-start: 3px solid currentColor;
  padding-inline-start: 12px;
  font-weight: 600;
}
`}</style>
    </Form>
  );
}
