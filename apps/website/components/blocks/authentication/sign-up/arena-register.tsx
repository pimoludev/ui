"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, PasswordInput, Select } from "@pimolu/react";

export function ArenaRegisterBlock() {
  const [region, setRegion] = useState("Europe");
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto grid max-w-5xl gap-8 rounded-2xl border border-border bg-primary/10 p-6 sm:p-10 md:grid-cols-2">
      <header className="flex flex-col justify-between gap-10">
        <div className="space-y-5">
          <Badge variant="primary">ORBIT / NEW PLAYER</Badge>
          <h2 className="text-3xl sm:text-5xl font-semibold uppercase tracking-tight">
            Start at
            <br />
            level one.
          </h2>
          <p className="max-w-xs text-muted">
            One identity for your next adventure. Bring your own play style.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3" aria-label="Sample game modes">
          {["Explore", "Build", "Compete"].map((x) => (
            <Card key={x} className="p-3 text-center text-xs">
              {x}
            </Card>
          ))}
        </div>
      </header>
      <Card className="p-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            setMessage(
              "Player " + d.get("handle") + " prepared in " + region + ". Demo only.",
            );
          }}
        >
          <h3 className="text-2xl font-medium">Create your player</h3>
          <Input
            label="Player handle"
            name="handle"
            pattern="[A-Za-z0-9_]{3,20}"
            title="3-20 letters, numbers or underscores"
            required
            fullWidth
          />
          <Input
            label="Account email"
            name="email"
            type="email"
            required
            autoComplete="email"
            fullWidth
          />
          <PasswordInput
            label="New player password"
            name="password"
            minLength={10}
            required
            autoComplete="new-password"
            fullWidth
          />
          <Select label="Region" value={region} onValueChange={setRegion} fullWidth>
            {["Europe", "Americas", "Asia Pacific"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Button type="submit" fullWidth>
            Create player
          </Button>
          <p className="text-sm text-muted" role="status">
            {message || "No real game account is created."}
          </p>
        </form>
      </Card>
    </section>
  );
}
