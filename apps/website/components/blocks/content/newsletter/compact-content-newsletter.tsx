"use client";

import { useState } from "react";
import { Button, Input, Checkbox, Image } from "@pimolu/react";

export function CompactContentNewsletterBlock() {
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Newsletter
        </h2>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <Image
          src="/images/pimolu-atmosphere.webp"
          alt="Pimolu editorial artwork"
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
        <div className="space-y-6">
          <h3 className="text-3xl">
            New work.
            <br />
            Thoughtful notes.
          </h3>

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
        </div>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
