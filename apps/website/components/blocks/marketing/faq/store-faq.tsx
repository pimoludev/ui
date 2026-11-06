"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
} from "@pimolu/react";

export function StoreFaqBlock() {
  const [topic, setTopic] = useState("Orders");
  const questions =
    topic === "Orders"
      ? [
          {
            q: "Can I update an order?",
            a:
              "Contact your store's support team with the order reference. " +
              "Replace this answer with your own edit and cancellation window.",
          },
          {
            q: "How do I track delivery?",
            a:
              "Connect an order tracking page to your shipping provider and " +
              "include the tracking link in the customer's order email.",
          },
        ]
      : [
          {
            q: "How do returns work?",
            a:
              "Publish the actual return period, conditions and process for " +
              "your business. This composition does not define a return policy.",
          },
          {
            q: "What if my item arrives damaged?",
            a:
              "Explain how customers can contact support, which details are " +
              "useful and what your resolution process looks like.",
          },
        ];
  return (
    <section className="mx-auto max-w-3xl space-y-8 p-6 sm:p-10">
      <header className="space-y-4 text-center">
        <Badge>STUDIO STORE / HELP</Badge>
        <h2 className="font-serif text-3xl sm:text-4xl">
          Good questions.
          <br />
          An easier shopping day.
        </h2>
      </header>
      <div className="flex flex-wrap justify-center gap-3">
        {["Orders", "Returns"].map((x) => (
          <Button
            key={x}
            aria-pressed={topic === x}
            appearance={topic === x ? "solid" : "outline"}
            onClick={() => setTopic(x)}
          >
            {x}
          </Button>
        ))}
      </div>
      <Accordion key={topic} collapsible>
        {questions.map((p) => (
          <AccordionItem key={p.q} value={p.q}>
            <AccordionTrigger>{p.q}</AccordionTrigger>
            <AccordionContent>{p.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="text-muted">Shipping, returns and everything in between.</p>
    </section>
  );
}
