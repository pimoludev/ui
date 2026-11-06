"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  PasswordInput,
} from "@pimolu/react";

export function SignUpBlock() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto w-full max-w-lg p-5 sm:p-8">
      <Card size="lg">
        <CardHeader>
          <p className="text-sm font-medium text-primary">A little space for you</p>
          <CardTitle>Create your account.</CardTitle>
          <p className="text-sm text-muted">
            Your next chapter starts with a few details.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setMessage("");
              const data = new FormData(event.currentTarget);
              if (data.get("password") !== data.get("confirmPassword")) {
                setError("The passwords do not match.");
                return;
              }
              setError("");
              setMessage(
                `Profile ready for ${String(data.get("name")).trim()}. This local preview does not create an account.`,
              );
            }}
          >
            <Input
              name="name"
              label="Full name"
              placeholder="Alex Morgan"
              autoComplete="name"
              required
              fullWidth
            />
            <Input
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              fullWidth
            />
            <PasswordInput
              name="password"
              label="Password"
              minLength={8}
              required
              fullWidth
              description="At least 8 characters. Use a fictional password in this preview."
              autoComplete="new-password"
              onValueChange={() => setError("")}
            />
            <PasswordInput
              name="confirmPassword"
              label="Confirm password"
              minLength={8}
              required
              fullWidth
              autoComplete="new-password"
              error={error}
              onValueChange={() => setError("")}
            />
            <Checkbox name="updates" label="Send me occasional product updates" />
            <Button type="submit" fullWidth>
              Create account
            </Button>
            <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
              {message}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
