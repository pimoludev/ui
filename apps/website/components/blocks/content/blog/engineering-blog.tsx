"use client";

import { useState } from "react";
import { Badge, Button, Card, SearchInput } from "@pimolu/react";

export function EngineeringBlogBlock() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const posts = [
    {
      title: "Designing a useful empty state",
      tag: "Design",
      body:
        "Explain what belongs in this space, why it is empty and what " +
        "someone can do next. Make the primary action specific to the " +
        "task.",
    },
    {
      title: "Treating focus as part of the interface",
      tag: "Accessibility",
      body:
        "Use meaningful controls and visible focus indicators. When a " +
        "dialog closes, return focus to the action that opened it so the " +
        "user keeps their place.",
    },
    {
      title: "Keeping examples small and complete",
      tag: "Engineering",
      body:
        "A copyable example should include its imports, state and " +
        "handlers. Remove demo-only abstractions and clearly identify " +
        "the services a real application must provide.",
    },
  ];
  const visible = posts.filter((p) =>
    (p.title + " " + p.tag).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="mx-auto max-w-4xl space-y-6 p-6 sm:p-10">
      <header className="space-y-4">
        <Badge variant="primary">ENGINEERING NOTES</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium">
          What we learn
          <br />
          while we build.
        </h2>
      </header>
      <SearchInput
        label="Search engineering notes"
        value={query}
        onValueChange={setQuery}
        className="w-full"
      />
      <p role="status" className="text-sm text-muted">
        {visible.length} notes
      </p>
      {visible.map((p) => (
        <Card key={p.title} className="space-y-4 p-6">
          <Badge>{p.tag}</Badge>
          <h3 className="text-xl font-medium">{p.title}</h3>
          <Button
            appearance="outline"
            aria-expanded={open === p.title}
            onClick={() => setOpen(open === p.title ? null : p.title)}
          >
            {open === p.title ? "Close note" : "Read " + p.title}
          </Button>
          {open === p.title && <p className="leading-relaxed text-muted">{p.body}</p>}
        </Card>
      ))}
      {!visible.length && <p>No notes match your search.</p>}
    </section>
  );
}
