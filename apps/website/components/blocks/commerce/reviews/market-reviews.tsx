"use client";

import { useState } from "react";
import { Badge, Button, Card, Select, Textarea, Input } from "@pimolu/react";

export function MarketReviewsBlock() {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("5");
  const [helpful, setHelpful] = useState<string[]>([]);
  const [filter] = useState("All");
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
      <div className="grid gap-7 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-serif text-3xl">Tell the next person.</h3>

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
        <Card className="h-fit p-6">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage(
                "Your " +
                  rating +
                  "-star review is prepared locally. Nothing published.",
              );
            }}
          >
            <Input label="Review name" required fullWidth />
            <Select
              label="Your rating"
              value={rating}
              onValueChange={setRating}
              fullWidth
            >
              {["5", "4", "3", "2", "1"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
            <Textarea label="Your review" required minLength={10} fullWidth />
            <Button type="submit">Prepare review</Button>
          </form>
        </Card>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
