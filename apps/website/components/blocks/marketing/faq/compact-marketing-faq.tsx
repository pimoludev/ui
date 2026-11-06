"use client";

import { useState } from "react";
import {
  Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  SearchInput,
} from "@pimolu/react";

export function CompactMarketingFaqBlock() {
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const questions = [
    {
      q: "Can I customize the layout?",
      a: "Yes. Change the composition and use the public component props and tokens.",
    },
    {
      q: "Does this form send email?",
      a: "No. Sample handlers stay local until you connect your email service.",
    },
    {
      q: "Can I use these examples commercially?",
      a: "Review the repository license and any separate image asset terms before publishing.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">FAQ</h2>
      </header>
      <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-5">
          <h3 className="font-serif text-3xl">A few clear answers.</h3>
          <SearchInput
            label="Find a question"
            value={query}
            onValueChange={setQuery}
            className="w-full"
          />
          <Button
            appearance="outline"
            onClick={() => setMessage("Support request prepared locally.")}
          >
            Ask another question
          </Button>
        </div>
        <Accordion type="single" collapsible>
          {questions
            .filter((x) =>
              (x.q + " " + x.a).toLowerCase().includes(query.toLowerCase()),
            )
            .map((x) => (
              <AccordionItem key={x.q} value={x.q}>
                <AccordionTrigger>{x.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="py-4 leading-relaxed">{x.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
