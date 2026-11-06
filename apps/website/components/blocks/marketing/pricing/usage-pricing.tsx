"use client";

import { useState } from "react";
import { Badge, Button, Card, Select } from "@pimolu/react";

export function UsagePricingBlock() {
  const [seats, setSeats] = useState("5");
  const [message, setMessage] = useState("");
  const total = Number(seats) * 12;
  return (
    <section className="mx-auto grid max-w-5xl gap-10 p-6 sm:p-10 md:grid-cols-2 md:items-center">
      <header className="space-y-5">
        <Badge>WORKSPACE / TEAMS</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
          Room for everyone.
          <br />
          One clear price.
        </h2>
        <p className="text-muted">
          A flexible workspace for the people behind your next big idea.
        </p>
        <ul className="list-inside list-disc space-y-3 text-sm">
          <li>Unlimited sample projects</li>
          <li>Shared team spaces</li>
          <li>Role-based collaboration</li>
        </ul>
      </header>
      <Card className="space-y-6 p-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl">Team plan</h3>
          <Badge variant="primary">$12 / seat</Badge>
        </div>
        <Select
          label="Team seats"
          value={seats}
          onValueChange={(v) => {
            setSeats(v);
            setMessage("");
          }}
          fullWidth
        >
          {[1, 5, 10, 25].map((n) => (
            <option key={n} value={n}>{`${n} seats`}</option>
          ))}
        </Select>
        <p className="text-3xl sm:text-5xl font-medium">
          ${total}
          <span className="text-sm text-muted"> / month</span>
        </p>
        <p className="text-sm text-muted">seats × $12, before tax.</p>
        <Button
          fullWidth
          onClick={() =>
            setMessage(
              seats + " seats selected at $" + total + "/month. No billing started.",
            )
          }
        >
          Choose team plan
        </Button>
        <p role="status" className="text-sm text-muted">
          {message || "Adjust your team size to compare."}
        </p>
      </Card>
    </section>
  );
}
