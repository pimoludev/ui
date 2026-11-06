"use client";

import { useState } from "react";
import { Badge, Button, Input, Select, Textarea } from "@pimolu/react";

export function AgencyContactBlock() {
  const [budget, setBudget] = useState("Exploring options");
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto max-w-4xl space-y-8 p-6 sm:p-12">
      <header className="space-y-4">
        <Badge>STUDIO / NEW COLLABORATIONS</Badge>
        <h2 className="font-serif text-3xl sm:text-5xl">
          It starts with
          <br />
          <em className="text-primary">a conversation.</em>
        </h2>
        <p className="text-muted">
          A product launch, a fresh identity, or something we haven&apos;t imagined yet.
        </p>
      </header>
      <form
        className="grid gap-6 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setMessage(
            "Brief prepared for " +
              new FormData(e.currentTarget).get("name") +
              " · " +
              budget +
              ". Nothing has been sent.",
          );
        }}
      >
        <Input label="Your name" name="name" required fullWidth />
        <Input label="Work email" name="email" type="email" required fullWidth />
        <Input label="Company (optional)" name="company" fullWidth />
        <Select
          label="Project budget"
          value={budget}
          onValueChange={setBudget}
          fullWidth
        >
          {["Exploring options", "Under $5,000", "$5,000–$15,000", "$15,000+"].map(
            (x) => (
              <option key={x}>{x}</option>
            ),
          )}
        </Select>
        <div className="sm:col-span-2">
          <Textarea label="The idea" name="brief" rows={4} minLength={20} required />
        </div>
        <Button type="submit">Prepare project brief</Button>
        <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
          {message}
        </p>
      </form>
    </section>
  );
}
