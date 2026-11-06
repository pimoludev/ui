"use client";

import { useState } from "react";
import { Badge, Button, Input } from "@pimolu/react";

export function CompactMarketingCtaBlock() {
  const [message, setMessage] = useState("");
  const [requested, setRequested] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Call to action
        </h2>
      </header>
      <div className="grid gap-7 border-y border-border py-8 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <Badge>YOUR NEXT CHAPTER</Badge>
          <h3 className="font-serif text-3xl sm:text-4xl">
            Good work starts
            <br />
            with a conversation.
          </h3>
          <p className="text-muted">
            A concise invitation for your service or product.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setRequested(true);
            setMessage(
              "Conversation prepared for " +
                new FormData(e.currentTarget).get("email") +
                ". No email sent.",
            );
          }}
        >
          <Input label="Contact email" name="email" type="email" required fullWidth />
          <Button type="submit" fullWidth>
            {requested ? "Prepared locally" : "Start a conversation"}
          </Button>
        </form>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
