"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, Checkbox } from "@pimolu/react";

export function CompactMarketingLaunchBlock() {
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Launch</h2>
      </header>
      <Card className="mx-auto max-w-xl space-y-6 border-t-4 border-primary p-6 sm:p-10">
        <Badge>COMING SOON / SAMPLE CAMPAIGN</Badge>
        <h3 className="text-3xl">
          Something good
          <br />
          is taking shape.
        </h3>
        <p className="text-muted">
          Three milestones: prototype, private preview, public launch.
        </p>
        <ol className="list-inside list-decimal space-y-3">
          <li>Prototype reviewed</li>
          <li>Private preview in progress</li>
          <li>Public date to be announced</li>
        </ol>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setJoined(true);
            setMessage(
              "Launch update prepared for " +
                new FormData(e.currentTarget).get("email") +
                ". No message sent.",
            );
          }}
        >
          <Input
            label="Launch updates email"
            name="email"
            type="email"
            required
            fullWidth
          />
          <Checkbox label="I agree to receive launch news" required />
          <Button type="submit" fullWidth>
            {joined ? "Update prepared" : "Keep me in the loop"}
          </Button>
        </form>
      </Card>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
