"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  SearchInput,
} from "@pimolu/react";

export function HelpCenterBlock() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const articles = [
    {
      title: "Update your profile",
      topic: "Account",
      text:
        "Open account settings, edit your display name and save. Replace " +
        "these sample instructions with your actual account flow.",
    },
    {
      title: "Manage your team roles",
      topic: "Teams",
      text:
        "Review each member's access level before changing permissions. " +
        "Owners should retain an active account for workspace recovery.",
    },
    {
      title: "Understand your invoice",
      topic: "Billing",
      text:
        "Your invoice should explain the billing period, seats and " +
        "applicable taxes. Add your actual billing support details here.",
    },
    {
      title: "Invite a collaborator",
      topic: "Teams",
      text:
        "Choose an appropriate role, verify the email address and send " +
        "an invitation through your application's service.",
    },
  ];
  const visible = articles.filter(
    (a) =>
      (topic === "All" || a.topic === topic) &&
      (a.title + " " + a.text).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="mx-auto max-w-4xl space-y-8 p-6 sm:p-10">
      <header className="space-y-4 text-center">
        <Badge variant="primary">HELP CENTER</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium">What can we clear up?</h2>
        <p className="text-sm text-muted">Search the knowledge base.</p>
      </header>
      <SearchInput
        label="Search help articles"
        value={query}
        onValueChange={setQuery}
        className="w-full"
      />
      <div className="flex flex-wrap gap-2">
        {["All", "Account", "Teams", "Billing"].map((x) => (
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
      <p role="status" className="text-sm text-muted">
        {visible.length} articles found
      </p>
      <Accordion collapsible>
        {visible.map((a) => (
          <AccordionItem key={a.title} value={a.title}>
            <AccordionTrigger>{a.title}</AccordionTrigger>
            <AccordionContent>{a.text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {!visible.length && (
        <p>No matching articles. Try another topic or search term.</p>
      )}
    </section>
  );
}
