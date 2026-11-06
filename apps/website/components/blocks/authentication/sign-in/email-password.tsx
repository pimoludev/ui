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

export function SignInBlock() {
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto w-full max-w-md p-5 sm:p-8">
      <Card size="lg">
        <CardHeader>
          <p className="text-sm font-medium text-muted">Your workspace</p>
          <CardTitle as="h2">Good to see you again.</CardTitle>
          <p className="text-sm text-muted">A familiar place for your next idea.</p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              const values = new FormData(event.currentTarget);
              setMessage(
                `Form ready for ${values.get("email")}. This demo does not sign you in.`,
              );
            }}
          >
            <Input
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="off"
              required
              fullWidth
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Use a fictional password"
              autoComplete="off"
              minLength={8}
              required
              fullWidth
            />
            <Checkbox name="remember" label="Remember this device" />
            <Button type="submit" fullWidth>
              Sign in
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
