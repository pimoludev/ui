"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  Footer,
  Input,
} from "@pimolu/react";

export function StoreFooterBlock() {
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto max-w-5xl p-6 sm:p-10">
      <div className="grid gap-10 border-b border-border pb-8 md:grid-cols-2">
        <header className="space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl">
            Good things.
            <br />
            Straight to your inbox.
          </h2>
          <p className="text-muted">New collections and notes from the studio.</p>
        </header>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (consent)
              setMessage("Newsletter request prepared. No address was subscribed.");
          }}
        >
          <Input label="Updates email" name="email" type="email" required fullWidth />
          <Checkbox
            label="I agree to receive store updates"
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
          />
          <Button type="submit" disabled={!consent}>
            Keep me posted
          </Button>
          <p role="status" className="text-sm text-muted">
            {message || "Local form. Add your own privacy policy."}
          </p>
        </form>
      </div>
      <Footer
        appearance="transparent"
        brand="STUDIO STORE"
        description="Objects for your everyday."
        columns={[]}
        copyright="Fictional storefront"
      />
      <Accordion collapsible>
        {["Shipping", "Returns", "Care guide"].map((x) => (
          <AccordionItem key={x} value={x}>
            <AccordionTrigger>{x}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted">
                {x === "Care guide"
                  ? "Keep your accessories dry and follow the manufacturer's care instructions."
                  : "Add your actual " +
                    x.toLowerCase() +
                    " policy here before publishing. These are sample store details."}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
