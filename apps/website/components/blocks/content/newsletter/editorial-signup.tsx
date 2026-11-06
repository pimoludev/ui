"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, Checkbox, Input } from "@pimolu/react";

export function EditorialSignupBlock() {
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto max-w-4xl p-5 sm:p-8">
      <Card size="lg">
        <CardContent className="grid gap-8 md:grid-cols-2">
          <header className="space-y-4">
            <Badge variant="primary">The studio letter</Badge>
            <h2 className="text-3xl font-medium">
              A fresh perspective.
              <br />
              Once a month.
            </h2>
            <p className="text-sm text-muted">
              Ideas on design, thoughtful details and building things that last.
            </p>
          </header>
          <form
            className="space-y-5"
            onChange={() => setMessage("")}
            onSubmit={(event) => {
              event.preventDefault();
              if (!consent) return;
              const email = new FormData(event.currentTarget).get("email");
              setMessage(
                `Subscription prepared for ${email}. Local preview; no address is stored.`,
              );
            }}
          >
            <Input
              label="Newsletter email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              fullWidth
            />
            <Checkbox
              label="I agree to receive the studio newsletter"
              checked={consent}
              onCheckedChange={(value) => {
                setConsent(value === true);
                setMessage("");
              }}
            />
            <Button type="submit" fullWidth disabled={!consent}>
              Subscribe to the letter
            </Button>
            <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
              {message}
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
