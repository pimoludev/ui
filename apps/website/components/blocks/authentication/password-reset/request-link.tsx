"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@pimolu/react";

export function PasswordResetBlock() {
  const [email, setEmail] = useState("");
  const [requestedEmail, setRequestedEmail] = useState("");

  return (
    <div className="mx-auto w-full max-w-md p-5 sm:p-8">
      <Card size="lg">
        <CardHeader>
          <p className="text-sm font-medium text-primary">A fresh start</p>
          <CardTitle>Find your way back.</CardTitle>
          <p className="text-sm text-muted">
            Enter your account email to prepare a password reset.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setRequestedEmail(email.trim());
            }}
          >
            <Input
              name="email"
              label="Account email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onValueChange={(value) => {
                setEmail(value);
                setRequestedEmail("");
              }}
              autoComplete="email"
              required
              fullWidth
            />
            <Button type="submit" fullWidth>
              Request reset link
            </Button>
          </form>
          <div className="break-words">
            {requestedEmail && (
              <Alert variant="success" title="Reset request ready">
                Request prepared for {requestedEmail}. No email has been sent by this
                local preview.
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
