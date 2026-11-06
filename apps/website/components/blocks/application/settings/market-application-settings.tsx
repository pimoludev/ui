"use client";

import { useState } from "react";
import { Button, Card, Switch } from "@pimolu/react";

export function MarketApplicationSettingsBlock() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(true);
  const [digest, setDigest] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h2>
      </header>
      <div className="grid gap-7 md:grid-cols-[14rem_1fr]">
        <div className="space-y-3">
          <h3 className="text-2xl">
            Your workspace.
            <br />
            Your rhythm.
          </h3>
          <p className="text-muted">Choose how often you hear from your team.</p>
        </div>
        <Card className="p-6">
          <div className="space-y-6">
            <Switch
              label="Email notifications"
              checked={email}
              onCheckedChange={setEmail}
            />
            <Switch
              label="Weekly summary"
              checked={digest}
              onCheckedChange={setDigest}
            />
            <Button
              onClick={() =>
                setMessage(
                  "Preferences saved locally: email " +
                    (email ? "on" : "off") +
                    ", summary " +
                    (digest ? "on" : "off"),
                )
              }
            >
              Save preferences
            </Button>
          </div>
        </Card>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
