"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Image,
  Input,
  PasswordInput,
} from "@pimolu/react";

export function SplitSignInBlock() {
  const [message, setMessage] = useState("");

  return (
    <section className="mx-auto grid max-w-5xl gap-6 p-5 sm:p-8 md:grid-cols-2">
      <Card size="lg" className="hidden justify-between bg-primary/10 md:flex">
        <Badge variant="primary">Pimolu / Studio</Badge>
        {/* Copy this asset into public/images/blocks, or replace it with your own photo. */}
        <Image
          src="/images/blocks/studio-office.jpg"
          alt="A welcoming studio workspace"
          aspectRatio="4 / 3"
          fit="cover"
          containerStyle={{ width: "100%" }}
        />
        <div className="space-y-3">
          <h2 className="text-3xl font-medium tracking-tight">
            A familiar place.
            <br />A new possibility.
          </h2>
          <p className="text-sm text-muted">
            Keep your projects, ideas and people together.
          </p>
        </div>
      </Card>
      <Card size="lg">
        <CardHeader>
          <p className="text-sm font-medium text-primary">Your workspace</p>
          <CardTitle>Good to have you back.</CardTitle>
          <p className="text-sm text-muted">Sign in to pick up where you left off.</p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              setMessage(
                `Ready to sign in as ${data.get("email")}. This preview does not authenticate you.`,
              );
            }}
          >
            <Input
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="username"
              required
              fullWidth
            />
            <PasswordInput
              name="password"
              label="Password"
              minLength={8}
              autoComplete="current-password"
              required
              fullWidth
            />
            <Checkbox name="remember" label="Keep me signed in" />
            <Button type="submit" fullWidth>
              Sign in
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
