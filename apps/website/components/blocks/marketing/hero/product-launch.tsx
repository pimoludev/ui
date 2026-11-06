"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, Input } from "@pimolu/react";

export function ProductLaunchBlock() {
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 p-5 sm:p-10 lg:grid-cols-2">
      <div className="space-y-6">
        <Badge variant="primary">Meet Orbit</Badge>
        <h2 className="text-4xl font-medium tracking-tight sm:text-5xl">
          Less busywork.
          <br />
          More room to create.
        </h2>
        <p className="text-muted">
          A calm workspace for projects, decisions and the people who move them forward.
        </p>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const email = new FormData(event.currentTarget).get("email");
            setMessage(
              `Invitation prepared for ${email}. Local preview; no email sent.`,
            );
          }}
        >
          <Input
            label="Work email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            fullWidth
          />
          <Button type="submit">Join the early access list</Button>
          <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
            {message}
          </p>
        </form>
      </div>
      <Card size="lg">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <span>Launch / Week 04</span>
            <Badge variant="success">On track</Badge>
          </div>
          <p className="text-5xl font-medium text-primary">84%</p>
          <p className="text-muted">Good ideas, taking shape.</p>
          <ul className="space-y-3 pl-5">
            <li>Brand direction approved</li>
            <li>Product flows reviewed</li>
            <li>Launch page in progress</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
