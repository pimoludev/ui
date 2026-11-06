"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, Select } from "@pimolu/react";

export function MarketAuthenticationOnboardingBlock() {
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <div className="mx-auto max-w-md space-y-6">
        <header className="space-y-2">
          <Badge>{complete ? "Ready to go" : "Store setup"}</Badge>
          <h2 className="text-2xl font-semibold tracking-tight">Set up your store</h2>
          <p className="text-sm text-muted">
            A name, a category, and you are ready to begin.
          </p>
        </header>
        <Card className="p-6 sm:p-8">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setComplete(true);
              setMessage(
                "Store setup prepared locally for " +
                  new FormData(e.currentTarget).get("store"),
              );
            }}
          >
            <Input label="Store name" name="store" required fullWidth />
            <Input label="Contact email" type="email" required fullWidth />
            <Select label="Store category" fullWidth>
              <option>Creative goods</option>
              <option>Audio</option>
              <option>Clothing</option>
            </Select>
            <Button type="submit" fullWidth>
              Prepare my store
            </Button>
          </form>
        </Card>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
