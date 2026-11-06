"use client";

import { useState } from "react";
import { Badge, Button, Card, Image, Input, PasswordInput } from "@pimolu/react";

export function ArenaLoginBlock() {
  const [message, setMessage] = useState("");
  return (
    <section className="relative isolate mx-auto max-w-5xl overflow-hidden rounded-2xl p-6 sm:p-12">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/pimolu-atmosphere.webp"
          alt=""
          containerStyle={{
            width: "100%",
            height: "100%",
          }}
          className="h-full w-full object-cover"
        />
      </div>
      <Card className="mx-auto max-w-md space-y-6 p-6 sm:p-8">
        <Badge variant="primary">ORBIT / PLAYER ACCESS</Badge>
        <h2 className="text-3xl sm:text-4xl font-semibold uppercase tracking-tight">
          Your next
          <br />
          adventure.
        </h2>
        <p className="text-sm text-muted">
          Meet your squad. Pick up where you left off.
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(
              "Player access prepared. Connect your authentication service to continue.",
            );
          }}
        >
          <Input
            label="Player email"
            type="email"
            name="email"
            autoComplete="username"
            required
            fullWidth
          />
          <PasswordInput
            label="Player password"
            name="password"
            autoComplete="current-password"
            required
            minLength={8}
            fullWidth
          />
          <Button type="submit" fullWidth>
            Enter the arena
          </Button>
        </form>
        <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
          {message}
        </p>
      </Card>
    </section>
  );
}
