"use client";

import { useState } from "react";
import { Badge, Button, Card, Switch } from "@pimolu/react";

export function CreatorMembershipBlock() {
  const [yearly, setYearly] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto max-w-4xl space-y-8 p-6 sm:p-10">
      <header className="mx-auto max-w-lg space-y-4 text-center">
        <Badge variant="primary">THE STUDIO LETTER / MEMBERS</Badge>
        <h2 className="font-serif text-3xl sm:text-5xl">
          Ideas worth
          <br />
          staying for.
        </h2>
        <p className="text-muted">A membership for curious people who make things.</p>
      </header>
      <Card className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
        <div className="space-y-5">
          <h3 className="text-2xl">Studio membership</h3>
          <Switch
            label="Pay yearly"
            checked={yearly}
            onCheckedChange={(v) => {
              setYearly(v);
              setMessage("");
            }}
          />
          <p className="text-3xl sm:text-5xl">
            ${yearly ? 80 : 8}
            <span className="text-sm text-muted"> / {yearly ? "year" : "month"}</span>
          </p>
          <p className="text-sm text-muted">
            {yearly
              ? "$80 charged once a year. Save $16 versus 12 monthly payments."
              : "$8 billed monthly. Sample terms."}
          </p>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <ul className="list-inside list-disc space-y-4">
            <li>Long-form field notes</li>
            <li>Monthly studio sessions</li>
            <li>A library of reading lists</li>
          </ul>
          <Button
            onClick={() =>
              setMessage(
                (yearly ? "Yearly $80" : "Monthly $8") +
                  " membership selected. No payment taken.",
              )
            }
          >
            Become a member
          </Button>
        </div>
      </Card>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
