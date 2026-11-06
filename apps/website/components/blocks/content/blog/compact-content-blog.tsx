"use client";

import { useState } from "react";
import { Badge, Button, Card, SearchInput } from "@pimolu/react";

export function CompactContentBlogBlock() {
  const [message] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState("");
  const articles = [
    {
      title: "Building a thoughtful storefront",
      tag: "Commerce",
      body: "Begin with a clear product story, accessible controls and honest delivery details.",
    },
    {
      title: "A practical launch checklist",
      tag: "Engineering",
      body: "Test mobile, keyboard, errors and empty states before sharing your next release.",
    },
    {
      title: "Designing for a little calm",
      tag: "Design",
      body: "Use hierarchy and meaningful spacing to guide people toward the next useful action.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Blog & articles
        </h2>
      </header>
      <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
        <aside className="space-y-4">
          <h3 className="font-serif text-3xl">Field notes.</h3>
          <SearchInput
            label="Find an article"
            value={query}
            onValueChange={setQuery}
            className="w-full"
          />
        </aside>
        <div className="space-y-4">
          {articles
            .filter((a) =>
              (a.title + " " + a.tag).toLowerCase().includes(query.toLowerCase()),
            )
            .map((a) => (
              <Card key={a.title} className="space-y-4 p-6">
                <Badge>{a.tag}</Badge>
                <h3 className="text-2xl">{a.title}</h3>
                <Button
                  appearance="outline"
                  aria-expanded={expanded === a.title}
                  onClick={() => setExpanded(expanded === a.title ? "" : a.title)}
                >
                  {expanded === a.title ? "Close " : "Read "}
                  {a.title}
                </Button>
                {expanded === a.title && (
                  <p className="leading-relaxed text-muted">{a.body}</p>
                )}
              </Card>
            ))}
        </div>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
