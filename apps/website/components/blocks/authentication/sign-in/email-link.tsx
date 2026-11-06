"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@pimolu/react";

export function EmailLinkBlock() {
  const [email, setEmail] = useState("");
  const [requested, setRequested] = useState(false);
  return (
    <div className="mx-auto max-w-lg p-5 sm:p-8">
      <Card size="lg">
        <CardHeader>
          <Badge variant="primary">Passwordless</Badge>
          <CardTitle>Your inbox is the key.</CardTitle>
          <p className="text-sm text-muted">
            A simple sign-in link, without another password.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setRequested(true);
            }}
          >
            <Input
              label="Sign-in email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              fullWidth
              value={email}
              onValueChange={(value) => {
                setEmail(value);
                setRequested(false);
              }}
            />
            <Button type="submit" fullWidth>
              {requested ? "Prepare another link" : "Send sign-in link"}
            </Button>
            <p role="status" className={requested ? "text-sm text-muted" : "sr-only"}>
              {requested
                ? `Link request prepared for ${email}. Local preview; no link or email is sent.`
                : ""}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
