"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, Select, Textarea } from "@pimolu/react";

export function SupportContactBlock() {
  const [topic, setTopic] = useState("Account");
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto grid max-w-5xl gap-8 p-6 sm:p-10 md:grid-cols-2">
      <header className="space-y-6">
        <Badge variant="primary">CUSTOMER CARE</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium">
          A human touch.
          <br />A clearer answer.
        </h2>
        <p className="text-muted">
          Tell us what happened and what you were trying to do.
        </p>
        <Card className="space-y-3 p-5">
          <h3 className="font-medium">Before you send</h3>
          <p className="text-sm text-muted">
            Never include passwords, payment card details or other sensitive
            information.
          </p>
        </Card>
      </header>
      <Card className="p-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(
              topic +
                " request prepared for " +
                new FormData(e.currentTarget).get("email") +
                ". No ticket was sent.",
            );
          }}
        >
          <Input label="Contact email" name="email" type="email" required fullWidth />
          <Select
            label="Support topic"
            value={topic}
            onValueChange={setTopic}
            fullWidth
          >
            {["Account", "Orders", "Technical issue"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Input
            label="Reference (optional)"
            name="reference"
            maxLength={60}
            fullWidth
          />
          <Textarea
            label="What happened?"
            name="details"
            minLength={15}
            required
            rows={4}
          />
          <Button type="submit">Prepare request</Button>
          <p role="status" className="text-sm text-muted">
            {message || "Connect this form to your support system."}
          </p>
        </form>
      </Card>
    </section>
  );
}
