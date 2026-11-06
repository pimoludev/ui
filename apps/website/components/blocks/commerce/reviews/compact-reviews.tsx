"use client";

import { useState } from "react";
import { Badge, Button, Card, Select } from "@pimolu/react";

export function CompactReviewsBlock() {
  const [message] = useState("");
  const [helpful, setHelpful] = useState<string[]>([]);
  const [filter, setFilter] = useState("All");
  const reviews = [
    {
      id: "maya",
      name: "Maya",
      stars: 5,
      title: "A thoughtful everyday companion",
      body: "Comfortable for a long studio session. Fictional review.",
    },
    {
      id: "noah",
      name: "Noah",
      stars: 4,
      title: "Quietly well made",
      body: "I would love another finish. Fictional review.",
    },
    {
      id: "alex",
      name: "Alex",
      stars: 5,
      title: "Just right for my desk",
      body: "A calm object in a busy workspace. Fictional review.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Reviews</h2>
      </header>
      <div className="grid gap-7 md:grid-cols-[14rem_1fr]">
        <Card className="h-fit space-y-5 p-6">
          <h3 className="text-4xl">4.7 / 5</h3>
          <p className="text-sm text-muted">From three reviews</p>
          <Select
            label="Filter rating"
            value={filter}
            onValueChange={setFilter}
            fullWidth
          >
            <option>All</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
          </Select>
        </Card>
        <div className="space-y-4">
          {reviews
            .filter((r) => filter === "All" || String(r.stars) === filter)
            .map((r) => (
              <Card key={r.id} className="space-y-4 p-5">
                <Badge>{r.stars + " / 5"}</Badge>
                <h3 className="text-xl">{r.title}</h3>
                <p className="text-muted">{r.body}</p>
                <p>{r.name + " / sample customer"}</p>
                <Button
                  appearance="ghost"
                  aria-pressed={helpful.includes(r.id)}
                  onClick={() =>
                    setHelpful(
                      helpful.includes(r.id)
                        ? helpful.filter((id) => id !== r.id)
                        : [...helpful, r.id],
                    )
                  }
                >
                  {helpful.includes(r.id) ? "Marked helpful" : "Helpful"}
                </Button>
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
