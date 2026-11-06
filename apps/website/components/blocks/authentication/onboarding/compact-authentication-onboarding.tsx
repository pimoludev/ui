"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, Select } from "@pimolu/react";

export function CompactAuthenticationOnboardingBlock() {
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <Card className="mx-auto max-w-md space-y-6 border-t-4 border-primary p-6 sm:p-8">
        <header className="space-y-3">
          <Badge variant={complete ? "success" : "primary"}>
            {complete ? "Profile ready" : "Player setup"}
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight">Make it your game</h2>
          <p className="text-sm text-muted">
            Choose a player name and your favorite way to play.
          </p>
        </header>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setComplete(true);
            setMessage("Player profile prepared.");
          }}
        >
          <Input label="Player name" pattern="[A-Za-z0-9_]{3,20}" required fullWidth />
          <Select label="Preferred game mode" fullWidth>
            <option>Co-op</option>
            <option>Ranked</option>
            <option>Creative</option>
          </Select>
          <Button type="submit" fullWidth>
            Prepare player profile
          </Button>
        </form>
      </Card>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
