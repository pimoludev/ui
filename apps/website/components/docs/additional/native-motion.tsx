"use client";

import { useState } from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Checkbox, Form, FormError, FormSubmit, Input, useForm,
} from "@pimolu/react";

export function DemoExample() {
  const [motion, setMotion] = useState(true);
  const [message, setMessage] = useState("");
  const form = useForm({
    defaultValues: { name: "" },
    validate: (values) => values.name.trim() ? {} : { name: "Enter your name to continue." },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setMessage("Saved locally: " + values.name);
    },
  });

  return (
    <div className="grid gap-5" data-pimolu-motion={motion ? undefined : "off"}>
      <Checkbox label="Enable native animations" checked={motion} onCheckedChange={setMotion} />
      <Accordion collapsible animated={motion}>
        <AccordionItem value="preferences">
          <AccordionTrigger>Workspace preferences</AccordionTrigger>
          <AccordionContent>
            <p>Content expands to its natural height and collapses smoothly.</p>
            <Form form={form} autoComplete="off">
              <Input label="Name" {...form.register("name")} />
              <FormError name="name" />
              <FormSubmit>{form.isSubmitting ? "Saving…" : "Save preferences"}</FormSubmit>
              <p role="status">{message}</p>
            </Form>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="privacy">
          <AccordionTrigger>Privacy and sharing</AccordionTrigger>
          <AccordionContent>
            <p>Choose who can see your work.</p>
            <p>A different height demonstrates natural sizing. Try switching rapidly.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
