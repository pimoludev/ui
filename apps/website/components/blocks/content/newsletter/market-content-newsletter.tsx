"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, Checkbox } from "@pimolu/react";

export function MarketContentNewsletterBlock() {
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Newsletter
        </h2>
      </header>
      <Card className="grid gap-8 p-6 sm:p-10 md:grid-cols-2">
        <div className="space-y-4">
          <Badge>ONE LETTER / EACH MONTH</Badge>
          <h3 className="font-serif text-3xl">
            A little inspiration.
            <br />
            Room to breathe.
          </h3>
          <p className="text-sm text-muted">
            A newsletter about the useful details of making things.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setJoined(true);
            setMessage(
              "Subscription prepared for " +
                new FormData(e.currentTarget).get("email") +
                ". No data sent.",
            );
          }}
        >
          <Input
            label="Newsletter email"
            name="email"
            type="email"
            required
            fullWidth
          />
          <Checkbox label="I agree to receive the newsletter" required />
          <Button type="submit" fullWidth>
            {joined ? "Prepared locally" : "Join the studio letter"}
          </Button>
        </form>
      </Card>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
