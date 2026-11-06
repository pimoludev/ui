"use client";

import { useState } from "react";
import {
  Button,
  Card,
  SearchInput,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@pimolu/react";

export function MarketApplicationHelpBlock() {
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const articles = [
    {
      title: "Invite a teammate",
      topic: "Teams",
      body: "Open People, choose a role and send an invitation from your application.",
    },
    {
      title: "Update your profile",
      topic: "Account",
      body: "Open Settings, edit your display name and save your profile.",
    },
    {
      title: "Find an order",
      topic: "Orders",
      body: "Open order history and search using your confirmed order number.",
    },
  ];
  const visible = articles.filter(
    (a) =>
      (topic === "All" || a.topic === topic) &&
      (a.title + " " + a.body).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Help</h2>
      </header>
      <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
        <aside className="space-y-5">
          <SearchInput
            label="Search support topics"
            value={query}
            onValueChange={setQuery}
            className="w-full"
          />
          <div className="flex flex-wrap gap-2">
            {["All", "Account", "Teams", "Orders"].map((x) => (
              <Button
                key={x}
                appearance={topic === x ? "solid" : "outline"}
                aria-pressed={topic === x}
                onClick={() => setTopic(x)}
              >
                {x}
              </Button>
            ))}
          </div>
        </aside>
        <Card className="min-w-0 p-5">
          <Accordion type="single" collapsible>
            {visible.map((a) => (
              <AccordionItem key={a.title} value={a.title}>
                <AccordionTrigger>{a.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-3">
                    <p>{a.body}</p>
                    <Button
                      appearance="outline"
                      onClick={() =>
                        setMessage("Thanks for your feedback on " + a.title)
                      }
                    >
                      This helped
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
      {visible.length === 0 && <p>No support topics match. Try another search.</p>}
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
