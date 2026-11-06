"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Image,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@pimolu/react";

export function CompactContentBlogPostBlock() {
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Blog post</h2>
      </header>
      <article className="mx-auto max-w-3xl space-y-7">
        <header className="space-y-4">
          <Badge>FIELD GUIDE / 4 MIN READ</Badge>
          <h3 className="font-serif text-3xl sm:text-5xl">
            The details that make
            <br />a store feel considered.
          </h3>
          <p className="text-sm text-muted">By the Studio team</p>
        </header>
        <Image
          src="/images/pimolu-studio.webp"
          alt="Pimolu product artwork"
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
        <section className="space-y-4">
          <h4 className="text-2xl">Start with a clear promise</h4>
          <p className="leading-relaxed">
            Help people understand what the product does, what it costs and what comes
            next. Put the important details close to the decision.
          </p>
        </section>
        <section className="space-y-4">
          <h4 className="text-2xl">Make uncertainty visible</h4>
          <p className="leading-relaxed">
            Show availability, delivery and returns using verified information. A calm
            layout works best when its content is trustworthy.
          </p>
        </section>
        <Accordion type="single" collapsible>
          <AccordionItem value="checklist">
            <AccordionTrigger>Store review checklist</AccordionTrigger>
            <AccordionContent>
              <ul className="list-inside list-disc space-y-2 py-4">
                <li>Explain the total price</li>
                <li>Check keyboard interaction</li>
                <li>Review narrow layouts</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button
          aria-pressed={saved}
          appearance="outline"
          onClick={() => {
            setSaved(!saved);
            setMessage(
              saved
                ? "Article removed from local reading list."
                : "Article saved to local reading list.",
            );
          }}
        >
          {saved ? "Saved to reading list" : "Save this guide"}
        </Button>
      </article>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
