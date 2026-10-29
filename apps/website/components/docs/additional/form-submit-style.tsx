"use client";

import { Form, FormSubmit, useForm } from "@pimolu/react";

export function DemoExample() {
  const form = useForm({
    defaultValues: {},
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    },
  });

  return (
    <Form form={form} className="grid gap-4">
      <FormSubmit classNames={{ root: "custom-form-submit-root", label: "save-label", spinner: "save-spinner" }}>
        {form.isSubmitting ? "Saving…" : "Save changes"}
      </FormSubmit>
      <style>{`
.custom-form-submit-root {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 3px;
}
.save-label {
  letter-spacing: 0.03em;
  font-weight: 600;
}
.save-spinner {
  color: var(--pimolu-warning);
}
`}</style>
    </Form>
  );
}
